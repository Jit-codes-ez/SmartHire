package com.smarthire.service;

import org.springframework.web.multipart.MultipartFile;

import com.smarthire.dto.cloudinary.CloudinaryUploadResponse;

public interface CloudinaryService {

    CloudinaryUploadResponse upload(MultipartFile file, String folderName);

    void delete(String publicId);

}