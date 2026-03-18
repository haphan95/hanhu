/**
 * Đại từ xưng hô theo tên khách:
 * - Tên có Anh/Chị (vd: Anh Cường, Chị Hoa) => cặp đôi xưng "em", gọi khách "anh chị"
 * - Tên có Bạn => xưng "mình", gọi khách "bạn"
 * - Tên có Em (vd: Em Phúc) => cặp đôi xưng "anh chị", gọi khách "em"
 * - Còn lại => xưng "mình", gọi khách "bạn"
 */
export interface Pronouns {
  /** Cách cặp đôi tự xưng: "tụi em" | "tụi mình" | "anh chị" */
  self: string;
  /** Cách gọi khách: "anh chị" | "bạn" | "em" */
  guest: string;
}

export function getPronouns(guestName: string): Pronouns {
  const name = guestName?.trim() ?? "";
  if (name.includes("Anh") ) {
    return { self: "tụi em", guest: "Anh" };
  }
  if (name.includes("Chị")) {
    return { self: "tụi em", guest: "Chị" };
  }
  if (name.includes("Cô") || name.includes("Chú")) {
    return { self: "con", guest: "Cô Chú" };  
  }
  if (name.includes("Bạn")) {
    return { self: "tụi mình", guest: "Bạn" };
  }
  if (name.includes("Em")) {
    return { self: "anh chị", guest: "Em" };
  }
  return { self: "tụi mình", guest: "Bạn" };
}
