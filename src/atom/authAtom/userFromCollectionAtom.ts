import { atom, RecoilState } from "recoil";


const userFromCollectionAtom: RecoilState<any | null> = atom<any | null>({
  key: "userFromCollectionAtom", // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});

export default userFromCollectionAtom;