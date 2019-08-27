export function isObject(item) {
    // return (item && typeof item === 'object' && !Array.isArray(item) && item !== null);
    return Object.prototype.toString.call(item) === `[object Object]`
}

/**
 * Deep merge two objects.
 * @param target
 * @param source
 */
export function mergeDeep(target, source) {
    if (isObject(target) && isObject(source)) {
        Object.keys(source).forEach(key => {
            if (isObject(source[key])) {
                if (!target[key]) Object.assign(target, { [key]: {} })
                mergeDeep(target[key], source[key])
            } else {
                Object.assign(target, { [key]: source[key] })
            }
        })
    }
    return target
}

export function isArray(...arg) {
    if(Array.isArray)
        return Array.isArray && Array.isArray(arg[0])
    else
        return Object.prototype.toString.call(arg[0]) === '[object Array]'
}
export function isReg(...arg) {
    return Object.prototype.toString.call(arg[0]) === '[object RegExp]'
}

export function isFunction(...arg) {
    return Object.prototype.toString.call(arg[0]) === '[object Function]'
}

export function isString(...arg) {
    return Object.prototype.toString.call(arg[0]) === '[object String]'
}