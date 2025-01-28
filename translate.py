from sys import argv
from pathlib import Path
from typing import Union
from code import Code
import re


non_containers = ["br", "hr", "img", "input"]


def get_os() -> str:
    try:
        from os import uname
        return uname()[0].lower()
    except ImportError:
        return "nt"


def verify_html(code: list[str]) -> str:
    for line in code:
        if line.count("<") > 1:
            return f"Can't parse '{line}'"

    return ""


def fix_multiline_p(code: list[str]) -> list[str]:
    data = []
    for line in code:
        if not line.replace("\t", "").replace("\n", "").strip():
            continue

        added = False
        if "'" in line:
            line = line.replace("'", "\\'")

        if not line.startswith("<") and not line.endswith(">"):
            if data and data[-1].count("<") == 0 and data[-1].count(">") == 0:
                added = True
                data[-1] += " " + line

        if not added:
            data.append(line)

    return data


def find_element_properties(line: str) -> Union[dict[str, any], str, None]:
    if "<" not in line:
        return line

    if "</" in line:
        return None

    data: dict[str, any] = dict()

    name = re.findall(r"<\w+ ", line)
    if not name:
        name = re.findall(r"<\w+>", line)

    data["name"] = name[0].replace("<", "")[:-1]

    if "open" in line:
        data["open"] = "true"

    for kind in ["class", "alt", "src", "href", "id", "for", "target", "style", "width", "height"]:
        # element_data = re.findall(kind + r'="[\w -/:;\[\](){}]+"', line)
        element_data = re.findall(kind + r'=".*?"', line)
        if element_data:
            element_data = element_data[0].replace(kind + '="', "")
            data[kind] = element_data[:-1]

    element_on_event = re.findall(r'on\w+=\{[\w -/:(){}]+}', line)
    if element_on_event:
        data["events"] = element_on_event

    return data


def element_to_js(varname: str, properties: dict[str, str]) -> list[str]:
    data = []
    data.append(f"\nlet {varname} = document.createElement('{properties['name']}');")

    if "class" in properties:
        data.append(f"{varname}.className = '{properties['class']}';")

    for kind in ["alt", "src", "href", "id", "for", "target", "style", "width", "height"]:
        if kind in properties:
            data.append(f"{varname}.setAttribute('{kind}', '{properties[kind]}');")
            # data.append(f"{varname}.{kind} = '{properties[kind]}';")

    if "open" in properties:
        data.append(f"{varname}.open = true;")

    if "events" in properties:
        for e in properties["events"]:
            e = e.split("=")
            data.append(f"{varname}.{e[0]} = function() {e[1]};")

    return data


def can_have_child(element_name: str) -> bool:
    global non_containers

    for non_c in non_containers:
        if non_c in element_name:
            return False

    return True


def translate_code_to_js(html_elements: list[str], js: Code) -> str:
    root_element = ""
    parent_stack = []
    defined_vars = []
    count = 0

    for line in html_elements:
        if not line:
            continue

        props = find_element_properties(line)
        if not parent_stack and isinstance(props, str):
            if not props:
                continue

            raise ValueError(f"There must be a parent to append the text or a close etiquette is misplaced\n"
                             f"  Near line {html_elements.index(line)}: '{line}'")

        if props is None:
            child = parent_stack.pop()
            if parent_stack:
                js.append_line(f"{parent_stack[-1]}.appendChild({child});")
            continue

        if isinstance(props, str):
            js.append_line(f"{parent_stack[-1]}.textContent = '{line}';")
            continue

        element_name = props["name"]
        if not root_element:
            root_element = element_name

        if element_name in defined_vars:
            element_name += str(count)
            count += 1

        defined_vars.append(element_name)

        add_right_away = not can_have_child(element_name)

        if element_name not in parent_stack and not add_right_away:
            parent_stack.append(element_name)

        data = element_to_js(element_name, props)
        for js_code in data:
            js.append_line(js_code)

        if add_right_away and parent_stack:
            js.append_line(f"{parent_stack[-1]}.appendChild({element_name});")

    return root_element


def translate_html(filename: str, code: list[str], script_id: str, script_replacement: bool) -> str:
    if not code:
        raise ValueError("No code to convert was found")

    js = Code()

    if script_replacement:
        js.append_line("document.addEventListener('DOMContentLoaded', function() {")
        js.append_line(f"let root_script = document.querySelector('script#{script_id}');")
    else:
        js.append_line(f"function {script_id}() " + "{")

    root = translate_code_to_js(code, js)

    if script_replacement:
        js.append_line(f"root_script.replaceWith({root});")
        js.append_line(f"{root}.id = '{script_id}'")
        js.append_line("})")
    else:
        id_replacement = "data_container" if "links" not in filename else "links"
        js.append_line(f"{root}.id = %a;" % id_replacement)
        js.append_line(f"document.getElementById(%a).replaceWith({root});" % id_replacement)
        js.append_line("}")

    # Comment next line to avoid minifying the code
    js.minify = True

    return str(js)


def translate_file(file_path: Path, script_replacement: bool):
    content: Union[str, list]
    with open(file_path, "r") as file:
        content = file.read()
        content = content.replace("\t", "").split("\n")

    output = verify_html(content)
    if output:
        print(output)
        print("  Cannot parse the HTML, please make sure there is just one HTML etiquette per line " \
              "(no closing etiquette in the same line). Remove any comment")
        exit(1)

    content = fix_multiline_p(content)

    filename = file_path.name.replace(file_path.suffix, "")

    output_file = file_path.with_name(filename + ".js")
    with open(output_file, "w") as file:
        file.write(translate_html(filename, content, filename, script_replacement))

    if script_replacement:
        print("  [ Required script ]")
        print(f'<script id="{filename}" src="path/to/{filename + ".js"}"></script>')


if __name__ == "__main__":
    argv.pop(0)

    single_file = True
    if not argv:
        single_file = False

    if single_file:
        os = get_os()
        path = argv[0]
        if "darwin" in os:
            path = path.replace("\\", "")

        path = Path(path)
        if not path.exists():
            print("The given file doesn't exists")
            exit(1)

        translate_file(path, True)
        exit(0)

    for path in Path("components").iterdir():
        if path.suffix != ".html":
            continue

        translate_file(path, True)

    if Path("files").exists():
        documents = []
        directories = [Path("files")]
        while directories:
            cwd = directories.pop(0)
            for element in cwd.iterdir():
                if element.is_file() and "html" in element.suffix:
                    documents.append(element)
                elif element.is_dir():
                    directories.append(element)

        for doc in documents:
            translate_file(doc, False)
