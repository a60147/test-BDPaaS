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

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.itri.data.Key;
import org.itri.data.ServletConfig;
import org.itri.data.entity.Platform;
import org.itri.data.entity.Status;
import org.itri.data.entity.User;
import org.itri.dataAccess.PlatformDBManager;
import org.itri.dataAccess.UserDBManager;
import org.itri.utils.DebugLog;


/**
 *
 * @author A40385
 */
@WebServlet(urlPatterns = {"/manualUpdatePlatform"})
public class ManualUpdatePlatform extends HttpServlet {
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
            PlatformDBManager platformDBManager = new PlatformDBManager();
            String userID = inputJSON.getString(Key.USER_ID);
            ArrayList<Platform> platformListOfCurrentUser = platformDBManager.getPlatformOfUser(userID);
            HashMap<String, Platform> platformMap = new HashMap<String, Platform>();
            for(Platform platform : platformListOfCurrentUser){
                String key = platform.getType() + "-" + platform.getProjectName();
                DebugLog.info("prepare key: " + key);
                platformMap.put(key, platform);
            }
            if(inputJSON.has(Key.DASHBOARD_URL)){
                String key = Key.K8S_DASHBOARD + "-bdpaas-" + userID;
                String projectName = "bdpaas-" + userID;
                String inputURL = inputJSON.getString(Key.DASHBOARD_URL);
                if(inputURL != null){
                    if(!inputURL.matches("")){
                        if(platformMap.get(key) == null) platformDBManager.addPlatform(userID, projectName, Key.K8S_DASHBOARD, inputURL);
                        else platformDBManager.editPlatform(userID, projectName, Key.K8S_DASHBOARD, inputURL);
                    }
                }
                
            }
            if(inputJSON.has(Key.GRAFANA_URL)){
                String key = Key.GRAFANA + "-bdpaas-" + userID;
                String projectName = "bdpaas-" + userID;
                String inputURL = inputJSON.getString(Key.DASHBOARD_URL);
                if(inputURL != null){
                    if(!inputURL.matches("")){
                        if(platformMap.get(key) == null) platformDBManager.addPlatform(userID, projectName, Key.GRAFANA, inputURL);
                        else platformDBManager.editPlatform(userID, projectName, Key.GRAFANA, inputURL);
                    }
                }
            }
            if(inputJSON.has(Key.APEX_PROJECT_LIST)){
                JSONArray apexProjectList = new JSONArray(inputJSON.getString(Key.APEX_PROJECT_LIST));
                for(int i=0; i< apexProjectList.length(); i++){
                    JSONObject currentItem = apexProjectList.getJSONObject(i);
                    String projectName = "";
                    if(currentItem.getBoolean(Key.IS_MANUAL_ADDED) == true)
                        projectName = "bdpaas-" + userID + "-manualAddedPlatform";
                    else
                        projectName = "bdpaas-" + userID + "-" + currentItem.getString(Key.PROJECT_NAME);
                    String key = currentItem.getString(Key.TYPE) + "-" + projectName;
                    String inputURL = currentItem.getString(Key.URL);
                    DebugLog.info("key: " + key);
                    if(inputURL != null){
                        if(!inputURL.matches("")){
                            if(platformMap.get(key) == null) platformDBManager.addPlatform(userID, projectName, currentItem.getString(Key.TYPE), inputURL);
                            else platformDBManager.editPlatform(userID, projectName, currentItem.getString(Key.TYPE), inputURL);
                        }
                    }
                }
            }
            if(inputJSON.has(Key.SPARK_PROJECT_LIST)){
                JSONArray sparkProjectList = new JSONArray(inputJSON.getString(Key.SPARK_PROJECT_LIST));
                for(int i=0; i< sparkProjectList.length(); i++){
                    JSONObject currentItem = sparkProjectList.getJSONObject(i);
                    String projectName = "";
                    if(currentItem.getBoolean(Key.IS_MANUAL_ADDED) == true)
                        projectName = "bdpaas-" + userID + "-manualAddedPlatform";
                    else
                        projectName = "bdpaas-" + userID + "-" + currentItem.getString(Key.PROJECT_NAME);
                    String key = currentItem.getString(Key.TYPE) + "-" + projectName;
                    String inputURL = currentItem.getString(Key.URL);
                    DebugLog.info("key: " + key);
                    if(inputURL != null){
                        if(!inputURL.matches("")){
                            if(platformMap.get(key) == null) platformDBManager.addPlatform(userID, projectName, currentItem.getString(Key.TYPE), inputURL);
                            else platformDBManager.editPlatform(userID, projectName, currentItem.getString(Key.TYPE), inputURL);
                        }
                    }
                }
            }
            jsonResult.put(Key.ERROR_CODE, Status.SUCCESS);
            
        } catch (JSONException ex) {
            Logger.getLogger(this.getClass().getName()).log(Level.SEVERE, null, ex);
        } catch (SQLException ex) {
            Logger.getLogger(ManualUpdatePlatform.class.getName()).log(Level.SEVERE, null, ex);
        } 
        finally {     
            out.print(jsonResult.toString());
            out.close();
        }
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
          JSONObject jsonObject =  new JSONObject(jsonBuffer.toString());
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
