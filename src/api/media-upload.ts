import {ImageInfo} from "expo-image-picker/build/ImagePicker.types";
import {HttpStatusCode} from "../constants/http-status";
import {SignedUrlResponseDto, SuccessfulRequestResponse, TokenDto} from "./dto";
import {requestBackend} from "./utils";

export async function uploadImage(token: TokenDto, image: ImageInfo, onFailure: () => void): Promise<string | null> {
    const response = await requestBackend("common/signedUrl", "GET", {mimeType: "image/jpeg"}, {}, token);

    if (response.status === HttpStatusCode.OK) {
        const payload = (response as SuccessfulRequestResponse).data;
        const {fileName, s3Url} = payload as SignedUrlResponseDto;

        try {
            // Fetch the image from the device and convert it to a blob
            const imageBlob = await (await fetch(image.uri)).blob();

            // PUT the image in the aws bucket
            await fetch(s3Url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/octet-stream",
                },
                body: imageBlob,
            });

            return fileName;
        } catch (error) {
            console.error(error);
            console.error("An unexpected error occured with a request to the avatar bucket.");
            onFailure();
            return null;
        }
    } else {
        onFailure();
        return null;
    }
}
