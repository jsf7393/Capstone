import matplotlib.pyplot as plt
import numpy as np
import json


def main():
    with open("./../attacker-website/evaluate_leakage.txt") as file:
        data = file.readline()

        json_objs = [x + "}" for x in data.split("}")][0:-1]

        parsed_objs = [json.loads(x) for x in json_objs]
        
        i = 1
        summed = np.zeros(len(parsed_objs[0]["1"]))
        for obj in parsed_objs:
            summed += np.array(obj[str(i)])
            i += 1

    i = 0
    white = True
    white_data = []
    black_data = []
    while i < 200000:
        if white:
            white_data.append(summed[i:i+2000])
            white = False
        else:
            black_data.append(summed[i:i+2000])
            white = True
        i += 2000
    plt.ecdf(np.concatenate(white_data), label="White")
    plt.ecdf(np.concatenate(black_data), label="Black")
    plt.legend()
    plt.title("CDFs of Cycle Frequencies for White vs Black Pixels")
    plt.xlabel("Cycle Frequency (cycles/ms)")
    plt.ylabel("Probability")
    plt.show()


if __name__ == "__main__":
    main()
