/*
    Author     : MuKai Huang
    Copyright (c) 2018 ITRI
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
import org.itri.data.entity.Status;
import org.itri.data.entity.User;
import org.itri.dataAccess.PlatformDBManager;
import org.itri.dataAccess.UserDBManager;
import org.itri.utils.DebugLog;


/**
 *
 * @author A40385
 */
@WebServlet(urlPatterns = {"/updatePlatform"})
public class UpdatePlatform extends HttpServlet {
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
            String userID = inputJSON.getString(Key.USER);
            JSONObject projectObject = inputJSON.getJSONObject(Key.PROJECT);
            String projectName = projectObject.getString(Key.NAME);
            String module = projectObject.getString(Key.MODULE);
            JSONObject returnObject = projectObject.getJSONObject(Key.RETURN);
            String returnResult = returnObject.getString(Key.RESULT);
            JSONArray commandArray = projectObject.getJSONArray(Key.COMMAND);
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
            PlatformDBManager platformDBManager = new PlatformDBManager();
            DebugLog.info("command: " +command);
            if(returnResult==null){
                
            }
            else if(returnResult.matches(ServletConfig.STATUS_TRUE)){
                
                if(command.matches(Key.CREATE)){
                    JSONObject urlsObject = returnObject.getJSONObject(Key.URLS);
                    if(urlsObject.has(Key.SPARK_MASTER)){
                        String sparkURL = urlsObject.getString(Key.SPARK_MASTER);
                        platformDBManager.addPlatform(userID, projectName, Key.SPARK, sparkURL);
                        platformDBManager.deleteTempPlatform(userID, projectName, Key.SPARK);
                    }
                    if(urlsObject.has(Key.SPARK_UI_PROXY)){
                        String sparkURL = urlsObject.getString(Key.SPARK_UI_PROXY);
                        platformDBManager.addPlatform(userID, projectName, Key.SPARK, sparkURL);
                        platformDBManager.deleteTempPlatform(userID, projectName, Key.SPARK);
                    }
                    if(urlsObject.has(Key.ZEPPELIN)){
                        String zeppelinURL = urlsObject.getString(Key.ZEPPELIN);
                        platformDBManager.deleteTempPlatform(userID, projectName, Key.ZEPPELIN);
                        platformDBManager.addPlatform(userID, projectName, Key.ZEPPELIN, zeppelinURL);
                    }
                    if(urlsObject.has(Key.APEX)){
                        String inputURL = urlsObject.getString(Key.APEX);
                        platformDBManager.deleteTempPlatform(userID, projectName, Key.APEX);
                        platformDBManager.addPlatform(userID, projectName, Key.APEX, inputURL);
                    }
                    if(urlsObject.has(Key.DATATORRENT_WEBUI)){
                        String inputURL = urlsObject.getString(Key.DATATORRENT_WEBUI);
                        platformDBManager.deleteTempPlatform(userID, projectName, Key.APEX);
                        platformDBManager.addPlatform(userID, projectName, Key.APEX, inputURL);
                    }
                    if(urlsObject.has(Key.HADOOP)){
                        String inputURL = urlsObject.getString(Key.HADOOP);
                        platformDBManager.deleteTempPlatform(userID, projectName, Key.HADOOP);
                        platformDBManager.addPlatform(userID, projectName, Key.HADOOP, inputURL);
                    }
                    if(urlsObject.has(Key.HADOOP_WEBUI)){
                        String inputURL = urlsObject.getString(Key.HADOOP_WEBUI);
                        platformDBManager.deleteTempPlatform(userID, projectName, Key.HADOOP);
                        platformDBManager.addPlatform(userID, projectName, Key.HADOOP, inputURL);
                    }
                    if(urlsObject.has(Key.YARN)){
                        String inputURL = urlsObject.getString(Key.YARN);
                        platformDBManager.deleteTempPlatform(userID, projectName, Key.YARN);
                        platformDBManager.addPlatform(userID, projectName, Key.YARN, inputURL);
                    }
                    if(urlsObject.has(Key.YARN_WEBUI)){
                        String inputURL = urlsObject.getString(Key.YARN_WEBUI);
                        platformDBManager.deleteTempPlatform(userID, projectName, Key.YARN);
                        platformDBManager.addPlatform(userID, projectName, Key.YARN, inputURL);
                    }
                    if(urlsObject.has(Key.K8S_DASHBOARD)){
                        String inputURL = urlsObject.getString(Key.K8S_DASHBOARD);
                        projectName = "bdpaas-" + userID;
                        platformDBManager.deleteTempPlatform(userID, projectName, Key.K8S_DASHBOARD);
                        if(platformDBManager.hasPlatform(userID, projectName, Key.K8S_DASHBOARD)) 
                            platformDBManager.editPlatform(userID, projectName, Key.K8S_DASHBOARD, inputURL);
                        else 
                            platformDBManager.addPlatform(userID, projectName, Key.K8S_DASHBOARD, inputURL);
                    }
                    if(urlsObject.has(Key.GRAFANA)){
                        String inputURL = urlsObject.getString(Key.GRAFANA);
                        projectName = "bdpaas-" + userID;
                        platformDBManager.deleteTempPlatform(userID, projectName, Key.GRAFANA);
                        if(platformDBManager.hasPlatform(userID, projectName, Key.GRAFANA)) 
                            platformDBManager.editPlatform(userID, projectName, Key.GRAFANA, inputURL);
                        else 
                            platformDBManager.addPlatform(userID, projectName, Key.GRAFANA, inputURL);
                    }
                }
                else if(command.matches(Key.DELETE)){
                    if(module.matches(Key.SPARK)){
                        platformDBManager.deletePlatform(userID, projectName, Key.SPARK);
                        platformDBManager.deletePlatform(userID, projectName, Key.ZEPPELIN);
                    }
                    else if(module.matches(Key.APEX)){
                        platformDBManager.deletePlatform(userID, projectName, Key.APEX);
                        platformDBManager.deletePlatform(userID, projectName, Key.HADOOP);
                        platformDBManager.deletePlatform(userID, projectName, Key.YARN);
                    }
                    else if(module.matches(Key.K8S_DASHBOARD)){
                        projectName = "bdpaas-" + userID;
                        platformDBManager.deletePlatform(userID, projectName, Key.K8S_DASHBOARD);
                    }
                    else if(module.matches(Key.GRAFANA)){
                        projectName = "bdpaas-" + userID;
                        platformDBManager.deletePlatform(userID, projectName, Key.GRAFANA);
                    }
                }
            }
            else{
                if(module.matches(Key.APEX)){
                    platformDBManager.deletePlatform(userID, projectName, Key.HADOOP);
                    platformDBManager.deleteTempPlatform(userID, projectName, Key.HADOOP);
                    platformDBManager.deletePlatform(userID, projectName, Key.YARN);
                    platformDBManager.deleteTempPlatform(userID, projectName, Key.YARN);
                    platformDBManager.deletePlatform(userID, projectName, Key.APEX);
                    platformDBManager.deleteTempPlatform(userID, projectName, Key.APEX);
                }
                else if(module.matches(Key.SPARK)){
                    platformDBManager.deletePlatform(userID, projectName, Key.SPARK);
                    platformDBManager.deleteTempPlatform(userID, projectName,  Key.SPARK);
                    platformDBManager.deletePlatform(userID, projectName, Key.ZEPPELIN);
                    platformDBManager.deleteTempPlatform(userID, projectName, Key.ZEPPELIN);
                }
            }
            
             jsonResult.put(Key.ERROR_CODE, Status.SUCCESS);
            
        } catch (JSONException ex) {
            Logger.getLogger(this.getClass().getName()).log(Level.SEVERE, null, ex);
        } catch (SQLException ex) {
            Logger.getLogger(UpdatePlatform.class.getName()).log(Level.SEVERE, null, ex);
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
