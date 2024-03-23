export default function sortResumeSections(arr) {
    const order = ['work_experience', 'projects', 'education', 'skills']
    return [...arr].sort((a, b) => {
        return order.indexOf(a) - order.indexOf(b)
    })
}