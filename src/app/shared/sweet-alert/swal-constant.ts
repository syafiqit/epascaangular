import Swal from "sweetalert2";

export const swalError = Swal.mixin({
    icon: 'error',
    reverseButtons: true,
    showClass: {
        popup: 'animate__animated animate__flipInY animate__faster'
    },
    hideClass: {
        popup: 'animate__animated animate__flipOutY animate__faster'
    }
})
export const swalInfo = Swal.mixin({
    icon: 'info',
    reverseButtons: true,
    showClass: {
        popup: 'animate__animated animate__flipInY animate__faster'
    },
    hideClass: {
        popup: 'animate__animated animate__flipOutY animate__faster'
    }
})

export const swalQuestion = Swal.mixin({
    icon: 'question',
    reverseButtons: true,
    showClass: {
        popup: 'animate__animated animate__flipInY animate__faster'
    },
    hideClass: {
        popup: 'animate__animated animate__flipOutY animate__faster'
    }
})

export const swalSuccess = Swal.mixin({
    icon: 'success',
    reverseButtons: true,
    showClass: {
        popup: 'animate__animated animate__flipInY animate__faster'
    },
    hideClass: {
        popup: 'animate__animated animate__flipOutY animate__faster'
    }
})

export const swalWarning = Swal.mixin({
    icon: 'warning',
    reverseButtons: true,
    showClass: {
        popup: 'animate__animated animate__flipInY animate__faster'
    },
    hideClass: {
        popup: 'animate__animated animate__flipOutY animate__faster'
    }
})
