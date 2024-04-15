import { create } from 'zustand';

interface UserState {
    token: string;
    f_name: string;
    l_name: string;
    image: string;
    roles: string[];
    tags: string[];
    uid: string;
}
interface loginState {
    f_name: string;
    l_name: string;
    image: string;
    roles: string[];
    tags: string[];
    uid: string;
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
    uid: '',

    login: ({ f_name, l_name, image, roles, tags, uid }: loginState) =>
        set(() => ({
            f_name,
            l_name,
            image,
            roles,
            tags,
            uid,
        })),

    logout: () =>
        set(() => ({
            token: '',
            f_name: '',
            l_name: '',
            image: '',
            roles: [],
            tags: [],
            uid: '',
        })),
}));
