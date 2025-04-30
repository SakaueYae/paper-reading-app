import axios from "axios";

export const deleteSession = async (
  id: string,
  accessToken: string,
  refreshToken: string
): Promise<boolean> => {
  try {
    await axios.delete(`/api/sessions/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "X-Refresh-Token": refreshToken,
      },
    });
    return true;
  } catch {
    return false;
  }
};
