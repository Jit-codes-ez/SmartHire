package com.smarthire.service.impl;

import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.smarthire.dto.cloudinary.CloudinaryUploadResponse;
import com.smarthire.exception.FileUploadException;
import com.smarthire.service.CloudinaryService;

@Service
public class CloudinaryServiceIMPL implements CloudinaryService {

    private final Cloudinary cloudinary;

    public CloudinaryServiceIMPL(Cloudinary cloudinary) {
        this.cloudinary = cloudinary;
    }

    @Override
    public CloudinaryUploadResponse upload(MultipartFile file, String folderName) {

        if (file == null || file.isEmpty()) {
            throw new FileUploadException("Resume file is required.");
        }

        try {
        	System.out.println("Original Filename = " + file.getOriginalFilename());
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
            System.out.println("Generated Filename = " + fileName);

            var result = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "resource_type", "auto",
                            "folder", "smarthire/students/" + folderName,
                            "public_id", fileName
                    )
            );
            
            System.out.println("Secure URL = " + result.get("secure_url"));
            System.out.println("Public ID = " + result.get("public_id"));

            return new CloudinaryUploadResponse(
                    result.get("secure_url").toString(),
                    result.get("public_id").toString()
            );
        } catch (Exception e) {
            throw new FileUploadException("Failed to upload resume to Cloudinary.", e);
        }
    }

    @Override
    public void delete(String publicId) {

        if (publicId == null || publicId.isBlank()) {
            return;
        }
        try {
            cloudinary.uploader().destroy(publicId,ObjectUtils.asMap("resource_type", "auto"));

        } catch (Exception e) {
            throw new FileUploadException("Failed to delete resume from Cloudinary.", e);
        }
    }
}