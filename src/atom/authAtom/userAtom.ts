import { atom, RecoilState } from "recoil";


const userAtom: RecoilState<any | null> = atom<any | null>({
  key: "userAtom", // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});

export default userAtom;

