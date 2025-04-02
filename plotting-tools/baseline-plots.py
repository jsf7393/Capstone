import matplotlib.pyplot as plt
import numpy as np
import json

def main():
    fig, (ax1, ax2, ax3) = plt.subplots(3)
    fig.suptitle("Baseline Plots")

    with open("./../attacker-website/white_baseline.txt") as file:
        data = file.readline()

        json_objs = [x + "}" for x in data.split("}")][0:-1]

        parsed_objs = [json.loads(x) for x in json_objs]
        
        i = 1
        summed = np.zeros(len(parsed_objs[0]["1"]))
        for obj in parsed_objs:
            summed += np.array(obj[str(i)])
            i += 1

        white_baseline = summed / len(parsed_objs)
        x = np.linspace(0, len(white_baseline), len(white_baseline))
        ax1.plot(x, white_baseline)

    with open("./../attacker-website/black_baseline.txt") as file:
        data = file.readline()

        json_objs = [x + "}" for x in data.split("}")][0:-1]

        parsed_objs = [json.loads(x) for x in json_objs]
        
        i = 12
        summed = np.zeros(len(parsed_objs[0]["12"]))
        for obj in parsed_objs:
            summed += np.array(obj[str(i)])
            i += 1

        black_baseline = summed / len(parsed_objs)
        x = np.linspace(0, len(black_baseline), len(black_baseline))
        ax2.plot(x, black_baseline)
    
    difference = np.abs(np.array(white_baseline) - np.array(black_baseline))
    x = np.linspace(0, len(difference), len(difference))
    ax3.plot(x, difference)

    plt.show()


if __name__ == "__main__":
    main()