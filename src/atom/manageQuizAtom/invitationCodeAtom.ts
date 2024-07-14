import { atom, RecoilState } from "recoil";


const invitationCodeAtom: RecoilState<any | null> = atom<any | null>({
  key: "invitationCodeAtom", // unique ID (with respect to other atoms/selectors)
  default: null, // default value (aka initial value)
});

export default invitationCodeAtom;