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
    login: (token: string, tags: string[]) => void;
    logout: () => void;
};

export const useUserStore = create<UserState & UserActions>((set, get) => ({
    name: '',
    image: '',
    token: '',
    tags: [],
    scopes: [],
    sub: '',

    login: (token : string, tags: string[]) => {
        const payload = token ? parseJWT(token) : {};

        set(() => ({
            token: token,
            tags: tags,
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
