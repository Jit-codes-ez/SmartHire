package com.smarthire.service.impl;


import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.smarthire.service.CloudinaryService;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;


@Service
public class CloudinaryServiceIMPL implements CloudinaryService {


    private final Cloudinary cloudinary;


    public CloudinaryServiceIMPL(Cloudinary cloudinary){

        this.cloudinary = cloudinary;

    }



    @Override
    public String upload(MultipartFile file) throws Exception {


        var result = cloudinary.uploader()
                .upload(
                        file.getBytes(),
                        ObjectUtils.emptyMap()
                );


        return result
                .get("secure_url")
                .toString();

    }

}