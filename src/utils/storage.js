const Cache = 'Cache'

export default {
    data() {
        return JSON.parse(window.localStorage.getItem(Cache) || "{}");
    },
    get(key) {
        return this.data()[key]
    },
    set(key, val) {
        let storage = this.data();
        storage[key] = val;
        window.localStorage.setItem(Cache, JSON.stringify(storage))
    },
    clear(key = null) {
        if (key) {
            let storage = this.data();
            delete storage[key];
            window.localStorage.setItem(Cache, JSON.stringify(storage))
        } else window.localStorage.clear();
    }
}