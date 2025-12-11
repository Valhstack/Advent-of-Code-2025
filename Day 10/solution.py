import re
import pulp


# ---------------------------
# Parsing functions
# ---------------------------

def parse_line(line):
    """
    Parses one line of puzzle input.

    Example line:
    [.......##] (0,1,2,3,6,7,8) (1,6,7,8) ... {201,226,8,...}

    Returns:
        mask_length  -> number of lights
        buttons      -> list of lists of indices
        target       -> list of target joltage integers
    """
    line = line.strip()

    # extract light pattern inside []
    pattern_match = re.search(r"\[([.#]+)\]", line)
    mask_length = len(pattern_match.group(1))

    # extract buttons inside ()
    button_strs = re.findall(r"\((.*?)\)", line)
    buttons = []
    for b in button_strs:
        if b.strip() == "":
            buttons.append([])
        else:
            buttons.append(list(map(int, b.split(","))))

    # extract joltage { ... }
    target_match = re.search(r"\{(.*?)\}", line)
    target = list(map(int, target_match.group(1).split(",")))

    return mask_length, buttons, target


def build_button_masks(mask_length, button_index_lists):
    """
    Converts each list of indices like [0,3,4] into a 0/1 mask vector.
    """
    masks = []
    for index_list in button_index_lists:
        mask = [0] * mask_length
        for idx in index_list:
            if 0 <= idx < mask_length:
                mask[idx] = 1
        masks.append(mask)
    return masks


# ---------------------------
# ILP solver for ONE row
# ---------------------------

def solve_row(mask_length, button_masks, target):
    """
    Builds and solves the ILP:
        minimize sum(x_i)
        subject to A x = target
        x_i >= 0 integer

    Returns:
        solution -> list of x_i values
        total    -> sum(x_i) minimum button presses
    """
    m = len(button_masks)
    n = mask_length

    prob = pulp.LpProblem("ButtonPressMinimization", pulp.LpMinimize)

    # decision vars: x_i = number of presses for button i
    x = [pulp.LpVariable(f"x{i}", lowBound=0, cat="Integer") for i in range(m)]

    # objective
    prob += pulp.lpSum(x)

    # constraints: Ax = target
    for j in range(n):
        prob += pulp.lpSum(x[i] * button_masks[i][j] for i in range(m)) == target[j]

    # solve using CBC (bundled with PuLP)
    prob.solve(pulp.PULP_CBC_CMD(msg=False))

    # read solution
    solution = [int(v.value()) for v in x]
    total = sum(solution)

    return solution, total


# ---------------------------
# Main
# ---------------------------

def main():
    filename = "input.txt"

    with open(filename, "r") as f:
        lines = [line.strip() for line in f if line.strip()]

    grand_total = 0  # sum of minimum presses across all rows

    for row_num, line in enumerate(lines):
        print(f"\n=== Row {row_num + 1} ===")
        mask_length, button_index_lists, target = parse_line(line)

        button_masks = build_button_masks(mask_length, button_index_lists)

        solution, total = solve_row(mask_length, button_masks, target)

        print("Minimum presses for this row:", total)
        grand_total += total

    print("\n====================")
    print("Total presses for ALL rows:", grand_total)
    print("====================")


if __name__ == "__main__":
    main()