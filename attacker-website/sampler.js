// Pass in # of seconds to sample for.
self.onmessage = function(event) {
    let cycle_count_array = [];
    let inc = 0;
    let curr = 0;
    
    //#region Javascript CPU frequency sampling
    // From Hertzbleed paper
    let prev = Date.now();
    while (cycle_count_array.length < event.data) {
        curr = Date.now();
        if (prev != curr) {
            cycle_count_array.push(inc);
            prev = curr;
            inc = 0;
        }
        inc += 1;
    }
    //#endregion

    self.postMessage(cycle_count_array);
};