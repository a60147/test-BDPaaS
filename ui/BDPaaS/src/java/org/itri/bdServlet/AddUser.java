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
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.codehaus.jettison.json.JSONArray;
import org.codehaus.jettison.json.JSONException;
import org.codehaus.jettison.json.JSONObject;
import org.itri.data.Key;
import org.itri.data.entity.Status;
import org.itri.data.entity.User;
import org.itri.dataAccess.ContainerManager;
import org.itri.dataAccess.PlatformDBManager;
import org.itri.dataAccess.UserDBManager;
import org.itri.utils.DebugLog;


/**
 *
 * @author A40385
 */
@WebServlet(urlPatterns = {"/addUser"})
public class AddUser extends HttpServlet {
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
        PrintWriter out = response.getWriter();
        JSONObject jsonResult = new JSONObject(); 
        try {
            if(userID == null){
                jsonResult.put(Key.ERROR_CODE, Status.NOT_LOGIN);
            }
            else{
                String targetUserID = request.getParameter(Key.USER_ID);
                String targetUserName = request.getParameter(Key.USER_NAME);
                String targetPassword = request.getParameter(Key.PASSWORD);
                String targetAuthority = request.getParameter(Key.AUTHORITY);
                String targetExpiredDate = request.getParameter(Key.EXPIRED_DATE);
                String targetApexProjectListString = request.getParameter(Key.APEX_PROJECT_LIST);
                String targetSparkProjectListString = request.getParameter(Key.SPARK_PROJECT_LIST);
                JSONArray targetApexProjectList = new JSONArray(targetApexProjectListString);
                JSONArray targetSparkProjectList = new JSONArray(targetSparkProjectListString);
                /*String apexURL = request.getParameter(Key.APEX_URL);
                String sparkURL = request.getParameter(Key.SPARK_URL);
                String zeppelinURL = request.getParameter(Key.ZEPPELIN_URL);
                String k8sDashboardURL = request.getParameter(Key.K8S_DASHBOARD_URL);
                String grafanaURL = request.getParameter(Key.GRAFANA_URL);
                String hadoopURL = request.getParameter(Key.HADOOP_URL);
                String yarnURL = request.getParameter(Key.YARN_URL);*/
                Timestamp expiredDate = null;
                if(targetExpiredDate == null) expiredDate = new Timestamp(2200, 12, 31, 23, 59, 59, 0);
                else if(targetExpiredDate.matches("")) expiredDate = new Timestamp(2200, 12, 31, 23, 59, 59, 0);
                else expiredDate = new Timestamp(Long.valueOf(targetExpiredDate));
                //check user exist
                UserDBManager userDBManager = new UserDBManager();
                PlatformDBManager platformDBManager = new PlatformDBManager();
                User existUser =  userDBManager.getTargetUser(targetUserID);
                ContainerManager containerManager = new ContainerManager();
                String xmlCreatePlatformURL = getServletContext().getInitParameter(Key.CREATE_PLATFORM_URL);
                String createPlatformURL = System.getProperty(Key.CREATE_PLATFORM_URL, xmlCreatePlatformURL);
                if(existUser == null){
                    boolean addResult = userDBManager.addUser(targetUserID, targetUserName, targetPassword, expiredDate, Integer.valueOf(targetAuthority));
                    if(addResult==true){
                        HashMap<String, Integer> projectNameList = new HashMap<String, Integer>();
                        for(int i=0; i<targetApexProjectList.length(); i++){
                            JSONObject currentProject = targetApexProjectList.getJSONObject(i);
                            String proejctName = "bdpaas-" + targetUserID + "-" + currentProject.getString(Key.PROJECT_NAME);
                            DebugLog.info("apex: " + proejctName);
                            if(projectNameList.get(proejctName)==null){
                                proejctName = proejctName + "-1";
                                projectNameList.put(proejctName, 1);
                            }
                            else{
                                int currentIndex = projectNameList.get(proejctName) + 1;
                                proejctName = proejctName + "-" + currentIndex;
                                projectNameList.put(proejctName, currentIndex);
                            }
                            JSONObject createdProjectObject = new JSONObject();
                            JSONObject userObject = new JSONObject();
                            userObject.put(Key.NAME, targetUserID);
                            JSONArray resourceArrayObject = new JSONArray();
                            resourceArrayObject.put(1);
                            resourceArrayObject.put("100MB");
                            userObject.put(Key.RESOURCE, resourceArrayObject);
                            createdProjectObject.put(Key.USER, userObject);
                            JSONObject projectObject = new JSONObject();
                            projectObject.put(Key.NAME, proejctName);
                            projectObject.put(Key.MODULE, Key.APEX);
                            JSONArray commandArrayObject = new JSONArray();
                            commandArrayObject.put(Key.CREATE);
                            projectObject.put(Key.COMMAND, commandArrayObject);
                            createdProjectObject.put(Key.PROJECT, projectObject);
                            //call api to create a new platform
                            DebugLog.info("create apex: " + createdProjectObject.toString());
                            platformDBManager.addTempPlatform(targetUserID, proejctName, Key.APEX, "");
                            containerManager.createPlatform(createPlatformURL, createdProjectObject);
                        }
                        for(int i=0; i<targetSparkProjectList.length(); i++){
                            JSONObject currentProject = targetSparkProjectList.getJSONObject(i);
                            String proejctName = "bdpaas-" + targetUserID + "-" + currentProject.getString(Key.PROJECT_NAME);
                            DebugLog.info("spark: " + proejctName);
                            if(projectNameList.get(proejctName)==null){
                                proejctName = proejctName + "-1";
                                projectNameList.put(proejctName, 1);
                            }
                            else{
                                int currentIndex = projectNameList.get(proejctName) + 1;
                                proejctName = proejctName + "-" + currentIndex;
                                projectNameList.put(proejctName, currentIndex);
                            }
                            JSONObject createdProjectObject = new JSONObject();
                            JSONObject userObject = new JSONObject();
                            userObject.put(Key.NAME, targetUserID);
                            JSONArray resourceArrayObject = new JSONArray();
                            resourceArrayObject.put(1);
                            resourceArrayObject.put("100MB");
                            userObject.put(Key.RESOURCE, resourceArrayObject);
                            createdProjectObject.put(Key.USER, userObject);
                            JSONObject projectObject = new JSONObject();
                            projectObject.put(Key.NAME, proejctName);
                            projectObject.put(Key.MODULE, Key.SPARK);
                            JSONArray commandArrayObject = new JSONArray();
                            commandArrayObject.put(Key.CREATE);
                            projectObject.put(Key.COMMAND, commandArrayObject);
                            createdProjectObject.put(Key.PROJECT, projectObject);
                            //call api to create a new platform
                            DebugLog.info("create spark: " + createdProjectObject.toString());
                            platformDBManager.addTempPlatform(targetUserID, proejctName, Key.SPARK, "");
                            containerManager.createPlatform(createPlatformURL, createdProjectObject);
                        }
                        
                        /*if(apexURL!=null){
                            if(!apexURL.matches("")) platformDBManager.addPlatform(targetUserID, Key.APEX, apexURL);
                        }
                        if(sparkURL!=null){
                            if(!sparkURL.matches("")) platformDBManager.addPlatform(targetUserID, Key.SPARK, sparkURL);
                        }
                        if(zeppelinURL!=null){
                            if(!zeppelinURL.matches("")) platformDBManager.addPlatform(targetUserID, Key.ZEPPELIN, zeppelinURL);
                        }
                        if(k8sDashboardURL!=null){
                            if(!k8sDashboardURL.matches(""))  platformDBManager.addPlatform(targetUserID, Key.K8S_DASHBOARD, k8sDashboardURL);
                        }
                        if(grafanaURL!=null){
                            if(!grafanaURL.matches(""))  platformDBManager.addPlatform(targetUserID, Key.GRAFANA, grafanaURL);
                        }
                        if(hadoopURL!=null){
                            if(!hadoopURL.matches(""))  platformDBManager.addPlatform(targetUserID, Key.HADOOP, hadoopURL);
                        }
                        if(yarnURL!=null){
                            if(!yarnURL.matches(""))  platformDBManager.addPlatform(targetUserID, Key.YARN, yarnURL);
                        }*/
                        jsonResult.put(Key.ERROR_CODE, Status.SUCCESS);
                    }
                    else{
                        jsonResult.put(Key.ERROR_CODE, Status.FAIL);
                    }
                }
                else{
                    jsonResult.put(Key.ERROR_CODE, Status.USER_EXIST);
                }
            }
        } catch(Exception e){
            Logger.getLogger(this.getClass().getName()).log(Level.SEVERE, null, e);
            try {
                jsonResult.put(Key.ERROR_CODE, Status.FAIL);
            } catch (JSONException ex) {
                Logger.getLogger(AddUser.class.getName()).log(Level.SEVERE, null, ex);
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
