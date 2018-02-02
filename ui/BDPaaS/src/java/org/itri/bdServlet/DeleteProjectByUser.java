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
import org.itri.dataAccess.ContainerManager;
import org.itri.dataAccess.PlatformDBManager;
import org.itri.dataAccess.UserDBManager;


/**
 *
 * @author A40385
 */
@WebServlet(urlPatterns = {"/deleteProjectByUser"})
public class DeleteProjectByUser extends HttpServlet {
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
        String userID = (String)request.getSession().getAttribute("userID");
        ServletOutputStream out = response.getOutputStream();
        JSONObject jsonResult = new JSONObject(); 
        System.out.println(inputJSON.toString());
        try {
            if(userID == null){
                jsonResult.put(Key.ERROR_CODE, Status.NOT_LOGIN);
            }
            else{
                PlatformDBManager platformDBManager = new PlatformDBManager();
                ContainerManager containerManager = new ContainerManager();
                String xmlCreatePlatformURL = getServletContext().getInitParameter(Key.CREATE_PLATFORM_URL);
                String createPlatformURL = System.getProperty(Key.CREATE_PLATFORM_URL, xmlCreatePlatformURL);
                String projectType = inputJSON.getString(Key.TYPE);
                String projectName = inputJSON.getString(Key.PROJECT_NAME);
                String proejctName = "bdpaas-" + userID + "-" + projectName;
                JSONObject deletedProjectObject = new JSONObject();
                JSONObject userObject = new JSONObject();
                userObject.put(Key.NAME, userID);
                JSONArray resourceArrayObject = new JSONArray();
                resourceArrayObject.put(1);
                resourceArrayObject.put("100MB");
                userObject.put(Key.RESOURCE, resourceArrayObject);
                deletedProjectObject.put(Key.USER, userObject);
                JSONObject projectObject = new JSONObject();
                projectObject.put(Key.NAME, proejctName);
                projectObject.put(Key.MODULE, projectType);
                JSONArray commandArrayObject = new JSONArray();
                commandArrayObject.put(Key.DELETE);
                projectObject.put(Key.COMMAND, commandArrayObject);
                deletedProjectObject.put(Key.PROJECT, projectObject);
                if(projectType.matches(Key.APEX)){
                    platformDBManager.deletePlatform(userID, proejctName, Key.APEX);
                    platformDBManager.deletePlatform(userID, proejctName, Key.HADOOP);
                    platformDBManager.deletePlatform(userID, proejctName, Key.YARN);
                }
                else if(projectType.matches(Key.SPARK)){
                    platformDBManager.deletePlatform(userID, proejctName, Key.SPARK);
                    platformDBManager.deletePlatform(userID, proejctName, Key.ZEPPELIN);
                }
                containerManager.deletePlatform(createPlatformURL, deletedProjectObject);    
                jsonResult.put(Key.ERROR_CODE, Status.SUCCESS);
            }

        } catch (JSONException ex) {
            Logger.getLogger(this.getClass().getName()).log(Level.SEVERE, null, ex);
        } catch (SQLException ex) {
            Logger.getLogger(DeleteProjectByUser.class.getName()).log(Level.SEVERE, null, ex);
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
