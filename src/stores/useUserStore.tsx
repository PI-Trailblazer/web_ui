import { create } from 'zustand';

interface UserState {
    token: string;
    f_name: string;
    l_name: string;
    image: string;
    roles: string[];
    tags: string[];
}
interface loginState {
    f_name: string;
    l_name: string;
    image: string;
    roles: string[];
    tags: string[];
}

type UserActions = {
    login: (data: loginState) => void;
    logout: () => void;
};

export const useUserStore = create<UserState & UserActions>((set, get) => ({
    f_name: '',
    l_name: '',
    image: '',
    token: '',
    roles: [],
    tags: [],

    login: ({ f_name, l_name, image, roles, tags }: loginState) =>
        set(() => ({
            f_name,
            l_name,
            image,
            roles,
            tags,
        })),

    logout: () =>
        set(() => ({
            token: '',
            f_name: '',
            l_name: '',
            image: '',
            roles: [],
            tags: [],
        })),
}));
