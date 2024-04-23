import { create } from 'zustand';
import { parseJWT } from "@/utils";

interface UserState {
    token: string;
    name: string;
    image: string;
    tags: string[];
    scopes: string[];
    sub: string;
}


type UserActions = {
    login: (token: string) => void;
    logout: () => void;
};

export const useUserStore = create<UserState & UserActions>((set, get) => ({
    name: '',
    image: '',
    token: '',
    tags: [],
    scopes: [],
    sub: '',

    login: (token : string) => {
        const payload = token ? parseJWT(token) : {};

        set(() => ({
            token: token,
            ...payload,
        }));
    },

    logout: () =>
        set(() => ({
            token: '',
            name: '',
            image: '',
            tags: [],
            scopes: [],
            sub: '',
        })),
}));
