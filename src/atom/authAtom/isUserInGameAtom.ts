import { atom, RecoilState } from "recoil";


const isUserInGameAtom: RecoilState<boolean> = atom<boolean>({
  key: "isUserInGameAtom", // unique ID (with respect to other atoms/selectors)
  default: false, // default value (aka initial value)
});

export default isUserInGameAtom;

