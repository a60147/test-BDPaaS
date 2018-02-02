/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.itri.data;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;

/**
 *
 * @author A40385
 */
public class FakeData {
    private static String JSON_PACKAGE_PATH = "/org/itri/data/json/";
    
    public static String getSparkProjectList() throws URISyntaxException, UnsupportedEncodingException, IOException{
        String fileName = "getSparkProjectList.json";
        java.net.URL url = FakeData.class.getResource(JSON_PACKAGE_PATH + fileName);
        java.nio.file.Path resPath = java.nio.file.Paths.get(url.toURI());
        String fakeResult = new String(java.nio.file.Files.readAllBytes(resPath), "UTF8"); 

        return fakeResult;
    }
    
}
