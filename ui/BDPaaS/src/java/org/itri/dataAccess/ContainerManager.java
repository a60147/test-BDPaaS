/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.itri.dataAccess;

import java.io.IOException;
import java.util.Iterator;
import java.util.logging.Level;
import java.util.logging.Logger;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.HttpClients;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.itri.bdServlet.SimulateCreatePlatform;

/**
 *
 * @author Chris
 */
public class ContainerManager {
    public ContainerManager(){
        
    }
    
    public void createPlatform(final String servletURL, final JSONObject requestJSON){
        Thread t = new Thread(new Runnable() {
            public void run() {
                try {
                    HttpPost method = new HttpPost(servletURL);
                    method.setHeader("Accept", "application/json");
                    method.setHeader("Content-type", "application/json");
                    HttpEntity inputEntity = new ByteArrayEntity(requestJSON.toString().getBytes("UTF-8"));
                    method.setEntity(inputEntity);
                    /*MultipartEntityBuilder reqEntityBuilder = MultipartEntityBuilder.create();        
                    reqEntityBuilder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
                    Iterator<String> keys = requestJSON.keys();
                    while (keys.hasNext()) {
                        String key = keys.next();
                        String val = null;
                        try{
                             JSONObject value = requestJSON.getJSONObject(key);
                             val = value.toString();
                        }catch(Exception e){
                            try {
                                val = requestJSON.getString(key);
                            } catch (JSONException ex) {
                                Logger.getLogger(ContainerManager.class.getName()).log(Level.SEVERE, null, ex);
                            }
                        }
                        reqEntityBuilder.addTextBody(key, val,  ContentType.DEFAULT_BINARY);    
                    }  */  

                    //method.setEntity(reqEntityBuilder.build());
                    HttpClient client = HttpClients.createDefault();
                    HttpResponse response = client.execute(method);
                    HttpEntity entity = response.getEntity();

                } catch (IOException ex) {
                    Logger.getLogger(SimulateCreatePlatform.class.getName()).log(Level.SEVERE, null, ex);
                } 
            }
        });
        t.start();
    }
    
    public void deletePlatform(final String servletURL, final JSONObject requestJSON){
        Thread t = new Thread(new Runnable() {
            public void run() {
                try {
                    HttpPost method = new HttpPost(servletURL);
                    method.setHeader("Accept", "application/json");
                    method.setHeader("Content-type", "application/json");
                    HttpEntity inputEntity = new ByteArrayEntity(requestJSON.toString().getBytes("UTF-8"));
                    method.setEntity(inputEntity);
                    /*MultipartEntityBuilder reqEntityBuilder = MultipartEntityBuilder.create();        
                    reqEntityBuilder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
                    Iterator<String> keys = requestJSON.keys();
                    while (keys.hasNext()) {
                        String key = keys.next();
                        String val = null;
                        try{
                             JSONObject value = requestJSON.getJSONObject(key);
                             val = value.toString();
                        }catch(Exception e){
                            try {
                                val = requestJSON.getString(key);
                            } catch (JSONException ex) {
                                Logger.getLogger(ContainerManager.class.getName()).log(Level.SEVERE, null, ex);
                            }
                        }
                        reqEntityBuilder.addTextBody(key, val,  ContentType.DEFAULT_BINARY);    
                    }  */  

                    //method.setEntity(reqEntityBuilder.build());
                    HttpClient client = HttpClients.createDefault();
                    HttpResponse response = client.execute(method);
                    HttpEntity entity = response.getEntity();

                } catch (IOException ex) {
                    Logger.getLogger(SimulateCreatePlatform.class.getName()).log(Level.SEVERE, null, ex);
                } 
            }
        });
        t.start();
    }
}
