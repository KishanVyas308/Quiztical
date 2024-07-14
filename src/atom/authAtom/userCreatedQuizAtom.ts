import { atom, RecoilState } from "recoil";


const userCreatedQuizAtom: RecoilState<any | null> = atom<any | null>({
  key: "userCreatedQuizAtom", // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});

export default userCreatedQuizAtom;