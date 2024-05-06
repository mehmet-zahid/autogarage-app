export default function (msg: string, type: string = 'info', duration: number = 5000) {
    ElMessage({
        showClose: true,
        duration: duration,
        message: msg,
        type: type,
    });
}