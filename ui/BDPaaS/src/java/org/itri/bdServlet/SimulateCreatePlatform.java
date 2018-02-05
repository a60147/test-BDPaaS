/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.itri.bdServlet;

import java.awt.Image;
import java.awt.image.BufferedImage;
import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.DataInputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.PrintWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.sql.SQLException;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.jar.JarEntry;
import java.util.jar.JarFile;
import java.util.logging.Level;
import java.util.logging.Logger;
import javafx.scene.control.Alert;
import javax.imageio.ImageIO;
import javax.servlet.ServletException;
import javax.servlet.ServletOutputStream;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.HttpClient;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ByteArrayEntity;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.HttpMultipartMode;
import org.apache.http.entity.mime.MultipartEntity;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.entity.mime.content.StringBody;
import org.apache.http.impl.client.HttpClients;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.itri.data.Key;
import org.itri.data.ServletConfig;
import org.itri.data.entity.Status;
import org.itri.data.entity.User;
import org.itri.dataAccess.PlatformDBManager;
import org.itri.dataAccess.UserDBManager;
import org.itri.utils.DebugLog;


/**
 *
 * @author A40385
 */
@WebServlet(urlPatterns = {"/simulateCreatePlatform"})
public class SimulateCreatePlatform extends HttpServlet {
    /**
     * Processes requests for both HTTP
     * <code>GET</code> and
     * <code>POST</code> methods.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    protected void processRequest(HttpServletRequest request, HttpServletResponse response, JSONObject inputJSON) throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        ServletOutputStream out = response.getOutputStream();
        JSONObject jsonResult = new JSONObject(); 
        DebugLog.info(inputJSON.toString());
        try {
            JSONObject userJSON = inputJSON.getJSONObject("user");
            String userID = userJSON.getString("name");
            JSONArray resourceArray = userJSON.getJSONArray("resource");
            
            JSONObject projectObject = inputJSON.getJSONObject("project");
            String projectName = projectObject.getString("name");
            String module = projectObject.getString("module");
            JSONArray commandArray = projectObject.getJSONArray("command");
            
            String returnURL = "http://localhost:8080/BDPaaS/updatePlatform";

            this.doUpdatePlatform(returnURL, userID, projectName, module, commandArray);
            
        } catch (JSONException ex) {
            Logger.getLogger(this.getClass().getName()).log(Level.SEVERE, null, ex);
        } 
        finally {     
            out.close();
        }
    }

     public void doUpdatePlatform(final String servletURL, final String userName, final String projectName, final String moduleName, final JSONArray commandArray){
        Thread t = new Thread(new Runnable() {
            public void run() {
                try {
                    HttpPost method = new HttpPost(servletURL);
                    JSONObject resultObject = new JSONObject();
                    resultObject.put("user", userName);
                    JSONObject projectObejct = new JSONObject();
                    projectObejct.put("name", projectName);
                    projectObejct.put("module", moduleName);
                    JSONObject returnObject = new JSONObject();
                    returnObject.put("result", "true");
                    JSONObject urlsObject = new JSONObject();
                    String command = "";
                    for(int i=0; i<commandArray.length(); i++){
                        if(commandArray.getString(i).matches(Key.CREATE)){
                            command = Key.CREATE;
                            break;
                        }
                        else if(commandArray.getString(i).matches(Key.DELETE)){
                            command = Key.DELETE;
                            break;
                        }
                    }
                    if(moduleName.matches("spark")){
                        urlsObject.put("spark-ui-proxy", "http://localhost:8080/spark");
                        urlsObject.put("zeppelin", "http://localhost:8080/zeppelin");
                    }
                    else if(moduleName.matches("apex")){
                        urlsObject.put("apex", "http://localhost:8080/datatorrent");
                        urlsObject.put("hadoop", "http://localhost:8080/hadoop");
                        urlsObject.put("yarn", "http://localhost:8080/yarn");
                    }
                    if(command.matches(Key.CREATE)){
                        urlsObject.put("k8sDashboard", "http://localhost:8080/k8sDashboard");
                        urlsObject.put("grafana", "http://localhost:8080/grafana");
                    }
                    returnObject.put("urls", urlsObject);
                    projectObejct.put("return", returnObject);
                    projectObejct.put("command", commandArray);
                    resultObject.put("project", projectObejct);
                    
                    HttpEntity inputEntity = new ByteArrayEntity(resultObject.toString().getBytes("UTF-8"));
                    method.setEntity(inputEntity);
                    Thread.sleep(5000);
                    /*MultipartEntityBuilder reqEntityBuilder = MultipartEntityBuilder.create();        
                    reqEntityBuilder.setMode(HttpMultipartMode.BROWSER_COMPATIBLE);
                    reqEntityBuilder.addTextBody("json", resultObject.toString(),  ContentType.DEFAULT_BINARY);

                    method.setEntity(reqEntityBuilder.build());*/
                    HttpClient client = HttpClients.createDefault();
                    HttpResponse response = client.execute(method);
                    HttpEntity entity = response.getEntity();

                } catch (IOException ex) {
                    Logger.getLogger(SimulateCreatePlatform.class.getName()).log(Level.SEVERE, null, ex);
                } catch (JSONException ex) {
                    Logger.getLogger(SimulateCreatePlatform.class.getName()).log(Level.SEVERE, null, ex);
                } catch (InterruptedException ex) {
                    Logger.getLogger(SimulateCreatePlatform.class.getName()).log(Level.SEVERE, null, ex);
                }
            }
        });
        t.start();
    }
    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP
     * <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        StringBuffer jsonBuffer = new StringBuffer();
        String line = null;
        try {
          BufferedReader reader = request.getReader();
          while ((line = reader.readLine()) != null)
            jsonBuffer.append(line);
        } catch (Exception e) {
            Logger.getLogger(this.getClass().getName()).log(Level.SEVERE, null, e);
        }

        try {
          JSONObject jsonObject =  new JSONObject(jsonBuffer.toString());
          processRequest(request, response, jsonObject);
        } catch (JSONException e) {
          // crash and burn
          throw new IOException(e.getMessage());
        }
    }

    /**
     * Handles the HTTP
     * <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        StringBuffer jsonBuffer = new StringBuffer();
        String line = null;
        try {
          BufferedReader reader = request.getReader();
          while ((line = reader.readLine()) != null){
              jsonBuffer.append(line);
          }
            
        } catch (Exception e) {
            Logger.getLogger(this.getClass().getName()).log(Level.SEVERE, null, e);
        }

        try {
            String inputString = jsonBuffer.toString();
            DebugLog.info(inputString);
          JSONObject jsonObject =  new JSONObject(inputString);
          processRequest(request, response, jsonObject);
        } catch (JSONException e) {
          // crash and burn
          throw new IOException(e.getMessage());
        }
        
        
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>
}
