from PIL import Image
import numpy as np
import json

def main():
    with open("./../attacker-website/youtube_data.txt") as file:
        data = json.load(file)

        image_data = data["1"]

        file.close()

    with open("./../attacker-website/white_baseline.txt") as file:
        data = json.load(file)

        white_baseline = data["1"]

        file.close()

    with open("./../attacker-website/black_baseline.txt") as file:
        data = json.load(file)

        black_baseline = data["1"]

        file.close()

    img_width = 28
    img_height = 28
    img = Image.new("RGB", (img_width, img_height), "white")

    pixels = img.load()

    i = 0
    x = 0
    y = 0
    while i <= len(image_data) - 1000:
        pixel_data = image_data[i:i+1000]
        white_difference = np.abs(np.array(pixel_data) - np.array(white_baseline[i:i+1000]))
        black_difference = np.abs(np.array(pixel_data) - np.array(black_baseline[i:i+1000]))
        if np.sum(white_difference) > np.sum(black_difference):
            pixels[x, y] = (0, 0, 0)

        i += 1000
        x += 1
        if x == img_width:
            x = 0
            y += 1
    
    img.show()
    input("Press ENTER to close")

if __name__ == "__main__":
    main()