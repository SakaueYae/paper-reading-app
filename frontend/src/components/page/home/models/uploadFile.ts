import axios, { isAxiosError } from "axios";
import { MessageList } from "@/components/layout/Chat/ChatContent";
import { fileUploadText } from "./text";

export const uploadFile = async (
  file: File,
  accessToken: string,
  refreshToken: string
): Promise<MessageList | string> => {
  try {
    const formData = new FormData();
    formData.append(file.name, file);
    const res = await axios.post("/api/pdf", formData, {
      headers: {
        "content-type": "multipart/form-data",
        Authorization: `Bearer ${accessToken}`,
        "X-Refresh-Token": refreshToken,
      },
    });

    return {
      sentMessage: {
        id: "file",
        file: {
          name: file.name,
        },
      },
      contents: [
        {
          id: "upload",
          file: {
            name: res.data.file_name,
            link: res.data.download_url,
          },
        },
        {
          id: "upload_text",
          message: fileUploadText,
        },
      ],
    };
  } catch (e) {
    if (isAxiosError(e)) return e.message;
    else return "エラーが発生しました。";
  }
};
