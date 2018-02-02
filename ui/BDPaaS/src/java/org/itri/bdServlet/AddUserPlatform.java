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
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.itri.data.Key;
import org.itri.data.entity.Platform;
import org.itri.data.entity.Status;
import org.itri.data.entity.User;
import org.itri.dataAccess.PlatformDBManager;
import org.itri.dataAccess.UserDBManager;


/**
 *
 * @author A40385
 */
@WebServlet(urlPatterns = {"/addUserPlatform"})
public class AddUserPlatform extends HttpServlet {
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
    protected void processRequest(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        JSONObject jsonResult = new JSONObject(); 
        try {
            String targetUserID = request.getParameter(Key.USER_ID);
            String targetProjectName = request.getParameter(Key.PROJECT_NAME);
            String targetModule = request.getParameter(Key.MODULE);
            String targetURL = request.getParameter(Key.URL);
            if(targetModule.matches("k8sDashboard")) targetProjectName = "bdpaas-" + targetUserID;
            else if(targetModule.matches("grafana")) targetProjectName = "bdpaas-" + targetUserID;
            
            UserDBManager userDBManager = new UserDBManager();
            PlatformDBManager platformDBManager = new PlatformDBManager();
            
            User targetUserData = userDBManager.getTargetUser(targetUserID);
            
            if(targetUserData!=null){
                ArrayList<Platform> platformListOfCurrentUser = platformDBManager.getPlatformOfUser(targetUserID);
                boolean foundPlatform = false;
                for(Platform currentPlatform : platformListOfCurrentUser){
                    if(currentPlatform.getProjectName().matches(targetProjectName) && currentPlatform.getType().matches(targetModule)){
                        foundPlatform = true;
                        break;
                    }
                }
                if(foundPlatform){
                    platformDBManager.editPlatform(targetUserID, targetProjectName, targetModule, targetURL);
                }
                else{
                    platformDBManager.addPlatform(targetUserID, targetProjectName, targetModule, targetURL);
                    platformDBManager.deleteTempPlatform(targetUserID, targetProjectName, targetModule);
                }
                jsonResult.put(Key.ERROR_CODE, Status.SUCCESS);
            }
            else{
                jsonResult.put(Key.ERROR_CODE, Status.FAIL);
            }
        } catch(Exception e){
            Logger.getLogger(this.getClass().getName()).log(Level.SEVERE, null, e);
            try {
                jsonResult.put(Key.ERROR_CODE, Status.FAIL);
            } catch (JSONException ex) {
                Logger.getLogger(AddUserPlatform.class.getName()).log(Level.SEVERE, null, ex);
            }
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
        processRequest(request, response);
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
        processRequest(request, response);
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
