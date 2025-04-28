# Capstone

## Initial Steps

Navigate first to the `attacker-website` directory, and then to the `victim-website` directory, and run

    > npm install

## Running the Difference of Means Experiment

When in the `attacker-website` directory, run

    > experiment.bat <ALTERNATE_FREQUENCY> <DATA_OUTPUT_FILE>

Replace `<ALTERNATE_FREQUENCY>` with the rate to alternate the pixel color in seconds, and replace
`<DATA_OUTPUT_FILE>` with the filename to write the data to.

## Running the Leakage Evaluation Experiment

When in the `attacker-website` directory, run

    > evaluate.bat

Then in the `plotting-tools` directory, run

    > python frequency-plots.py

## Running the Website Fingerprinting Experiment

When in the `attacker-website` directory, run

    > baseline.bat
    > attack.bat <TARGET_LOGO>

Replace `<TARGET_LOGO>` with either "facebook", "reddit", "whatsapp", or "youtube" depending on which logo you want to try and reconstruct.