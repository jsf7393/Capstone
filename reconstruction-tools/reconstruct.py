from PIL import Image
import numpy as np
import json

def main():
    with open("./../attacker-website/youtube_data.txt") as file:
        data = json.load(file)

        image_data = data["1"]

        file.close()

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

        file.close()

    with open("./../attacker-website/black_baseline.txt") as file:
        data = file.readline()

        json_objs = [x + "}" for x in data.split("}")][0:-1]

        parsed_objs = [json.loads(x) for x in json_objs]
        
        i = 1
        summed = np.zeros(len(parsed_objs[0]["1"]))
        for obj in parsed_objs:
            summed += np.array(obj[str(i)])
            i += 1

        black_baseline = summed / len(parsed_objs)

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