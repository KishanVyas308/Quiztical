import { atom, RecoilState } from "recoil";


const serCreatedQuizAtom: RecoilState<any | null> = atom<any | null>({
  key: "serCreatedQuizAtom", // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});

export default serCreatedQuizAtom;