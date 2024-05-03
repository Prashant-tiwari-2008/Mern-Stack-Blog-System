import { combineReducers, configureStore } from "@reduxjs/toolkit";
import themeReducer from './theme/themeSlice';
import useReducer from "./user/userSlice";
import blogReducer from "./blog/blogSlice";
import storage from 'redux-persist/lib/storage';
import { persistStore, persistReducer } from 'redux-persist'

const rootReducer = combineReducers({
    user: useReducer,
    theme: themeReducer,
    blog : blogReducer
});

const persistConfig = {
    key : "root",
    storage,
    version: 1
}

const persistedReducer = persistReducer(persistConfig, rootReducer)
export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefultMiddleware) =>
        getDefultMiddleware({ serializableCheck: false })
})

export const persistor = persistStore(store);