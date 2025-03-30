import matplotlib.pyplot as plt
import numpy as np
import json

def main():
    fig, (ax1, ax2, ax3) = plt.subplots(3)
    fig.suptitle("Baseline Plots")

    with open("./../attacker-website/white_baseline.txt") as file:
        data = json.load(file)

        white_baseline = data["1"]
        x = np.linspace(0, len(white_baseline), len(white_baseline))
        ax1.plot(x, white_baseline)

    with open("./../attacker-website/black_baseline.txt") as file:
        data = json.load(file)

        black_baseline = data["1"]
        x = np.linspace(0, len(black_baseline), len(black_baseline))
        ax2.plot(x, black_baseline)
    
    difference = np.abs(np.array(white_baseline) - np.array(black_baseline))
    x = np.linspace(0, len(difference), len(difference))
    ax3.plot(x, difference)

    plt.show()


if __name__ == "__main__":
    main()