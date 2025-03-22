self.onmessage = function(event) {
    let result = event.data;
    while (true) {
        result = result * result;
    }
}