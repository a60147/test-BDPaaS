/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.itri.bdServlet;

import java.awt.image.BufferedImage;
import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
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
import org.itri.data.entity.Platform;
import org.itri.data.entity.Status;
import org.itri.dataAccess.ContainerManager;
import org.itri.dataAccess.PlatformDBManager;
import org.itri.dataAccess.UserDBManager;
import org.itri.utils.DebugLog;


/**
 *
 * @author A40385
 */
@WebServlet(urlPatterns = {"/deleteUser"})
public class DeleteUser extends HttpServlet {
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
        String userID = (String)request.getSession().getAttribute("userID");
        String targetUserID = request.getParameter("targetUserID");
        ServletOutputStream out = response.getOutputStream();
        JSONObject jsonResult = new JSONObject(); 
        try {
            if(userID == null){
                jsonResult.put(Key.ERROR_CODE, Status.NOT_LOGIN);
            }
            else{
                UserDBManager userDBManager = new UserDBManager();
                PlatformDBManager platformDBManager = new PlatformDBManager();
                boolean result = userDBManager.deleteUser(targetUserID);
                ArrayList<Platform> platformList = platformDBManager.getPlatformOfUser(targetUserID);
                ContainerManager containerManager = new ContainerManager();
                String xmlCreatePlatformURL = getServletContext().getInitParameter(Key.CREATE_PLATFORM_URL);
                String createPlatformURL = System.getProperty(Key.CREATE_PLATFORM_URL, xmlCreatePlatformURL);
                for(Platform currentPlatform : platformList){
                    if(currentPlatform.getType().matches(Key.APEX) || currentPlatform.getType().matches(Key.SPARK)){
                        JSONObject deletedProjectObject = new JSONObject();
                        JSONObject userObject = new JSONObject();
                        userObject.put(Key.NAME, userID);
                        JSONArray resourceArrayObject = new JSONArray();
                        resourceArrayObject.put(1);
                        resourceArrayObject.put("100MB");
                        userObject.put(Key.RESOURCE, resourceArrayObject);
                        deletedProjectObject.put(Key.USER, userObject);
                        JSONObject projectObject = new JSONObject();
                        projectObject.put(Key.NAME, currentPlatform.getProjectName());
                        projectObject.put(Key.MODULE, currentPlatform.getType());
                        JSONArray commandArrayObject = new JSONArray();
                        commandArrayObject.put(Key.DELETE);
                        projectObject.put(Key.COMMAND, commandArrayObject);
                        deletedProjectObject.put(Key.PROJECT, projectObject);
                        containerManager.deletePlatform(createPlatformURL, deletedProjectObject);    
                    }
                    
                }
                platformDBManager.deleteAllPlatforms(targetUserID);
                DebugLog.info(result);
                jsonResult.put(Key.ERROR_CODE, Status.SUCCESS);
            }
            
        } catch(SQLException e){
            try {
                jsonResult.put(Key.ERROR_CODE, Status.FAIL);
            } catch (JSONException ex) {
                Logger.getLogger(this.getClass().getName()).log(Level.SEVERE, null, ex);
            }
        } catch (JSONException ex) {
            Logger.getLogger(this.getClass().getName()).log(Level.SEVERE, null, ex);
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
