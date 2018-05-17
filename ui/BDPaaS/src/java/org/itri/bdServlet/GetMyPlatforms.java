/*
    Author     : MuKai Huang
    Copyright (c) 2018 ITRI
 */
package org.itri.bdServlet;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;
import java.net.MalformedURLException;
import java.net.URL;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.itri.data.Key;
import org.itri.data.ServletConfig;
import org.itri.data.Utils;
import org.itri.data.entity.Platform;
import org.itri.data.entity.Status;
import org.itri.data.entity.User;
import org.itri.dataAccess.PlatformDBManager;
import org.itri.dataAccess.UserDBManager;


/**
 *
 * @author A40385
 */
@WebServlet(urlPatterns = {"/getMyPlatforms"})
public class GetMyPlatforms extends HttpServlet {
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
        Integer authority = (Integer)request.getSession().getAttribute("authority");
        PrintWriter out = response.getWriter();
        JSONObject jsonResult = new JSONObject(); 
        try {
            if(userID == null){
                jsonResult.put(Key.ERROR_CODE, Status.NOT_LOGIN);
            }
            else{
                PlatformDBManager platformDBManager = new PlatformDBManager();
                ArrayList<Platform> platformList = platformDBManager.getPlatformOfUser(userID);
                JSONArray platformJSONList = new JSONArray();   
                for(Platform currentPlatform : platformList){
                    JSONObject platformJSON = new JSONObject();
                    if(currentPlatform.getType().matches(Key.K8S_DASHBOARD)){
                        if(authority == ServletConfig.AUTHORITY_ADMIN){
                            platformJSON.put(Key.TYPE, currentPlatform.getType());
                            //platformJSON.put(Key.URL, currentPlatform.getURL());
                            String tempURL = Utils.getConvertedIP(request, currentPlatform.getURL());
                            platformJSON.put(Key.URL, tempURL);
                            platformJSON.put(Key.PROJECT_NAME, currentPlatform.getProjectName());
                            jsonResult.put(Key.K8S_DASHBOARD, currentPlatform.getURL());
                        }
                    }
                    else{
                        platformJSON.put(Key.TYPE, currentPlatform.getType());
                        String tempURL = currentPlatform.getURL();
                        if(currentPlatform.getType().matches(Key.ZEPPELIN) || currentPlatform.getType().matches(Key.APEX)){
                            tempURL = Utils.getConvertedURL(request, currentPlatform.getType(), currentPlatform.getURL());
                        }
                        else{
                            tempURL = Utils.getConvertedIP(request, currentPlatform.getURL());
                        }
                        platformJSON.put(Key.URL, tempURL);
                        //platformJSON.put(Key.URL, currentPlatform.getURL());
                        platformJSON.put(Key.PROJECT_NAME, currentPlatform.getProjectName());
                    }
                    platformJSON.put(Key.IS_CREATING, false);
                    /*if(currentPlatform.getType().matches(Key.APEX)) platformJSON.put(Key.APEX_URL, currentPlatform.getURL());
                    else if(currentPlatform.getType().matches(Key.SPARK)) platformJSON.put(Key.SPARK_URL, currentPlatform.getURL());
                    else if(currentPlatform.getType().matches(Key.HADOOP)) platformJSON.put(Key.HADOOP_URL, currentPlatform.getURL());
                    else if(currentPlatform.getType().matches(Key.K8S_DASHBOARD)) platformJSON.put(Key.K8S_DASHBOARD_URL, currentPlatform.getURL());
                    else if(currentPlatform.getType().matches(Key.ZEPPELIN)) platformJSON.put(Key.ZEPPELIN_URL, currentPlatform.getURL());
                    else if(currentPlatform.getType().matches(Key.YARN)) platformJSON.put(Key.YARN_URL, currentPlatform.getURL());
                    else if(currentPlatform.getType().matches(Key.GRAFANA)) platformJSON.put(Key.GRAFANA_URL, currentPlatform.getURL());  */  
                    platformJSONList.put(platformJSON);
                } 
                ArrayList<Platform> tempPlatformList = platformDBManager.getTempPlatformOfUser(userID);
                for(Platform currentPlatform : tempPlatformList){
                    JSONObject platformJSON = new JSONObject();
                    if(currentPlatform.getType().matches(Key.K8S_DASHBOARD)){
                        if(authority == ServletConfig.AUTHORITY_ADMIN){
                            platformJSON.put(Key.TYPE, currentPlatform.getType());
                            String tempURL = Utils.getConvertedIP(request, currentPlatform.getURL());
                            platformJSON.put(Key.URL, tempURL);
                            //platformJSON.put(Key.URL, currentPlatform.getURL());
                            platformJSON.put(Key.PROJECT_NAME, currentPlatform.getProjectName());
                            jsonResult.put(Key.K8S_DASHBOARD, currentPlatform.getURL());
                        }
                    }
                    else{
                        platformJSON.put(Key.TYPE, currentPlatform.getType());
                        String tempURL = Utils.getConvertedIP(request, currentPlatform.getURL());
                        platformJSON.put(Key.URL, tempURL);
                        //platformJSON.put(Key.URL, currentPlatform.getURL());
                        platformJSON.put(Key.PROJECT_NAME, currentPlatform.getProjectName());
                    }
                    platformJSON.put(Key.IS_CREATING, true);
                    platformJSONList.put(platformJSON);
                } 
                jsonResult.put(Key.PLATFORM, platformJSONList);
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
