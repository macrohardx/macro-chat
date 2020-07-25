export const today = () => {
    let d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
}