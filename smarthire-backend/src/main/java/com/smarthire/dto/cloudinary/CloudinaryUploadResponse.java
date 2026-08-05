package com.smarthire.dto.cloudinary;

public class CloudinaryUploadResponse {

    private String url;
    private String publicId;

    public CloudinaryUploadResponse() {
    }

    public CloudinaryUploadResponse(String url, String publicId) {
        this.url = url;
        this.publicId = publicId;
    }

    public String getUrl() {
        return url;
    }

    public void setUrl(String url) {
        this.url = url;
    }

    public String getPublicId() {
        return publicId;
    }

    public void setPublicId(String publicId) {
        this.publicId = publicId;
    }
}