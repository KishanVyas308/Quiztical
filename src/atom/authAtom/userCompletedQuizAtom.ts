import { atom, RecoilState } from "recoil";


const userCompletedQuizAtom: RecoilState<any | null> = atom<any | null>({
  key: "userCompletedQuizAtom", // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});

export default userCompletedQuizAtom;