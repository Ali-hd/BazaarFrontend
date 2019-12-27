import {USER, POST} from '../constants/index'

const loadUser = pageid =>({
    type: USER.LOAD,
    pageid,
})

const setUser = user => ({
    type: USER.LOAD_SUCCESS,
    user,
});

const setError = error => ({
    type: USER.LOAD_FAIL,
    error,
});

const loadPost = pageid => ({
    type: POST.LOAD,
    pageid,
});

const getposts = post => ({
    type: POST.LOAD_SUCCESS,
    post,
});

const errorPost = error => ({
    type: POST.LOAD_FAIL,
    error,
});


export {
    loadUser,
    setUser,
    setError,
    getposts,
    loadPost,
    errorPost,
}