/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.itri.dataAccess;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Blob;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import org.itri.data.Key;
import org.itri.data.entity.Column;
import org.itri.data.entity.Database;
import org.itri.data.entity.Platform;
import org.itri.data.entity.Table;
import org.itri.data.entity.User;
import org.itri.data.entity.Utils;
import org.itri.utils.DebugLog;


/**
 *
 * @author Chris
 */
public class PlatformDBManager {
    private static PlatformDBManager instance = null;
    private InitialContext context;
    private DataSource myDataSource; 
    public PlatformDBManager(){
        try {
            context = new InitialContext();
            myDataSource = (DataSource) context.lookup(Database.BDPAAS_DATABASE);
        } catch (NamingException ex) {
            Logger.getLogger(this.getClass().getName()).log(Level.SEVERE, null, ex);
        }
    }
    
    private java.sql.Connection connect() {
        Connection myConnect = null;
        try {
            myConnect = myDataSource.getConnection();
        } catch (SQLException se) {
            se.printStackTrace();
        }
        return myConnect;
    }
    
    public ArrayList<Platform> getK8SDashboardPlatforms() throws SQLException{
        java.sql.Connection myConnect = connect();
        PreparedStatement myStatement = null;
        ResultSet myResultSet = null;
        ArrayList<Platform> result = new ArrayList<Platform>();
        try{
            myStatement = myConnect.prepareStatement("SELECT * FROM " + Table.PLATFORM + " WHERE " + Column.PLATFORM_TYPE + "=?");  
            myStatement.setString(1, Key.K8S_DASHBOARD);
            myResultSet = myStatement.executeQuery();
            while (myResultSet.next()) {
                Platform newPlatform = new Platform(myResultSet.getString(Column.PROJECT_NAME), myResultSet.getString(Column.PLATFORM_TYPE), myResultSet.getString(Column.PLATFORM_URL), myResultSet.getString(Column.USER_ID));
                result.add(newPlatform);

            }
        }catch (SQLException ex) {
                ex.printStackTrace();
                throw new SQLException();
        } finally {  
            Utils.releaseConnectionResource(myConnect, myStatement, myResultSet, this.getClass().getName());
            return result;   
        }
    }
    
    public ArrayList<Platform> getSparkConsolePlatforms() throws SQLException{
        java.sql.Connection myConnect = connect();
        PreparedStatement myStatement = null;
        ResultSet myResultSet = null;
        ArrayList<Platform> result = new ArrayList<Platform>();
        try{
            myStatement = myConnect.prepareStatement("SELECT * FROM " + Table.PLATFORM + " WHERE " + Column.PLATFORM_TYPE + "=?");  
            myStatement.setString(1, Key.SPARK);
            myResultSet = myStatement.executeQuery();
            while (myResultSet.next()) {
                Platform newPlatform = new Platform(myResultSet.getString(Column.PROJECT_NAME), myResultSet.getString(Column.PLATFORM_TYPE), myResultSet.getString(Column.PLATFORM_URL), myResultSet.getString(Column.USER_ID));
                result.add(newPlatform);

            }
        }catch (SQLException ex) {
                ex.printStackTrace();
                throw new SQLException();
        } finally {  
            Utils.releaseConnectionResource(myConnect, myStatement, myResultSet, this.getClass().getName());
            return result;   
        }
    }
    
    public ArrayList<Platform> getHadoopPlatforms() throws SQLException{
        java.sql.Connection myConnect = connect();
        PreparedStatement myStatement = null;
        ResultSet myResultSet = null;
        ArrayList<Platform> result = new ArrayList<Platform>();
        try{
            myStatement = myConnect.prepareStatement("SELECT * FROM " + Table.PLATFORM + " WHERE " + Column.PLATFORM_TYPE + "=?");  
            myStatement.setString(1, Key.HADOOP);
            myResultSet = myStatement.executeQuery();
            while (myResultSet.next()) {
                Platform newPlatform = new Platform(myResultSet.getString(Column.PROJECT_NAME), myResultSet.getString(Column.PLATFORM_TYPE), myResultSet.getString(Column.PLATFORM_URL), myResultSet.getString(Column.USER_ID));
                result.add(newPlatform);

            }
        }catch (SQLException ex) {
                ex.printStackTrace();
                throw new SQLException();
        } finally {  
            Utils.releaseConnectionResource(myConnect, myStatement, myResultSet, this.getClass().getName());
            return result;   
        }
    }
    
    public ArrayList<Platform> getYarnPlatforms() throws SQLException{
        java.sql.Connection myConnect = connect();
        PreparedStatement myStatement = null;
        ResultSet myResultSet = null;
        ArrayList<Platform> result = new ArrayList<Platform>();
        try{
            myStatement = myConnect.prepareStatement("SELECT * FROM " + Table.PLATFORM + " WHERE " + Column.PLATFORM_TYPE + "=?");  
            myStatement.setString(1, Key.YARN);
            myResultSet = myStatement.executeQuery();
            while (myResultSet.next()) {
                Platform newPlatform = new Platform(myResultSet.getString(Column.PROJECT_NAME), myResultSet.getString(Column.PLATFORM_TYPE), myResultSet.getString(Column.PLATFORM_URL), myResultSet.getString(Column.USER_ID));
                result.add(newPlatform);

            }
        }catch (SQLException ex) {
                ex.printStackTrace();
                throw new SQLException();
        } finally {  
            Utils.releaseConnectionResource(myConnect, myStatement, myResultSet, this.getClass().getName());
            return result;   
        }
    }
    
    public ArrayList<Platform> getPlatformOfUser(String userID) throws SQLException{
        java.sql.Connection myConnect = connect();
        PreparedStatement myStatement = null;
        ResultSet myResultSet = null;
        ArrayList<Platform> result = new ArrayList<Platform>();
        try{
            myStatement = myConnect.prepareStatement("SELECT * FROM " + Table.PLATFORM + " WHERE " + Column.USER_ID + "=?");  
            DebugLog.info("SELECT * FROM " + Table.PLATFORM + " WHERE " + Column.USER_ID + "=" + userID);
            myStatement.setString(1, userID);
            myResultSet = myStatement.executeQuery();
            while (myResultSet.next()) {
                Platform newPlatform = new Platform(myResultSet.getString(Column.PROJECT_NAME), myResultSet.getString(Column.PLATFORM_TYPE), myResultSet.getString(Column.PLATFORM_URL));
                result.add(newPlatform);

            }
        }catch (SQLException ex) {
                ex.printStackTrace();
                throw new SQLException();
        } finally {  
            Utils.releaseConnectionResource(myConnect, myStatement, myResultSet, this.getClass().getName());
            return result;   
        }
    }
    
    public ArrayList<Platform> getTempPlatformOfUser(String userID) throws SQLException{
        java.sql.Connection myConnect = connect();
        PreparedStatement myStatement = null;
        ResultSet myResultSet = null;
        ArrayList<Platform> result = new ArrayList<Platform>();
        try{
            myStatement = myConnect.prepareStatement("SELECT * FROM " + Table.TEMP_PLATFORM + " WHERE " + Column.USER_ID + "=?");  
            DebugLog.info("SELECT * FROM " + Table.PLATFORM + " WHERE " + Column.USER_ID + "=" + userID);
            myStatement.setString(1, userID);
            myResultSet = myStatement.executeQuery();
            while (myResultSet.next()) {
                Platform newPlatform = new Platform(myResultSet.getString(Column.PROJECT_NAME), myResultSet.getString(Column.PLATFORM_TYPE), myResultSet.getString(Column.PLATFORM_URL));
                result.add(newPlatform);

            }
        }catch (SQLException ex) {
                ex.printStackTrace();
                throw new SQLException();
        } finally {  
            Utils.releaseConnectionResource(myConnect, myStatement, myResultSet, this.getClass().getName());
            return result;   
        }
    }
    
    public boolean hasPlatform(String userID, String projectName, String platformType){
        java.sql.Connection myConnect = connect();
        PreparedStatement myStatement = null;
        ResultSet myResultSet = null;
        boolean result = false;
        try{
             myStatement = myConnect.prepareStatement("SELECT * FROM " + Table.PLATFORM + " WHERE " + Column.USER_ID + "=? AND " + Column.PROJECT_NAME + "=? AND " + Column.PLATFORM_TYPE + "=?");             
            int updateRow = 0; 
            myStatement.setString(1, userID);
            myStatement.setString(2, projectName);
            myStatement.setString(3, platformType);
            myResultSet = myStatement.executeQuery();
            if (myResultSet.next()) {
                result = true;
            }
        }catch (SQLException ex) {
                ex.printStackTrace();
                result = false;
                throw new SQLException();
        } finally {  
            Utils.releaseConnectionResource(myConnect, myStatement, myResultSet, this.getClass().getName());
            return result;   
        }
    }
    
    public boolean addPlatform(String userID, String projectName, String platformType, String platformURL) throws SQLException{
        java.sql.Connection myConnect = connect();
        PreparedStatement myStatement = null;
        ResultSet myResultSet = null;
        boolean result = false;
        try{
            myStatement = myConnect.prepareStatement(" INSERT INTO " + Table.PLATFORM + " (" + Column.ID + "," + Column.USER_ID + "," + Column.PLATFORM_TYPE + ","
                    + Column.PLATFORM_URL + "," + Column.PROJECT_NAME + ") VALUES (NULL,?,?,?, ?)", Statement.RETURN_GENERATED_KEYS);            
            int updateRow = 0; 
            myStatement.setString(1, userID);
            myStatement.setString(2, platformType);
            myStatement.setString(3, platformURL);
            myStatement.setString(4, projectName);
            updateRow = myStatement.executeUpdate();
            result = true;
        }catch (SQLException ex) {
                ex.printStackTrace();
                result = false;
                throw new SQLException();
        } finally {  
            Utils.releaseConnectionResource(myConnect, myStatement, myResultSet, this.getClass().getName());
            return result;   
        }
    }
    
    public boolean addTempPlatform(String userID, String projectName, String platformType, String platformURL) throws SQLException{
        java.sql.Connection myConnect = connect();
        PreparedStatement myStatement = null;
        ResultSet myResultSet = null;
        boolean result = false;
        try{
            DebugLog.info("addTempPlatform");
            myStatement = myConnect.prepareStatement(" INSERT INTO " + Table.TEMP_PLATFORM + " (" + Column.ID + "," + Column.USER_ID + "," + Column.PLATFORM_TYPE + ","
                    + Column.PLATFORM_URL + "," + Column.PROJECT_NAME + ") VALUES (NULL,?,?,?, ?)", Statement.RETURN_GENERATED_KEYS);            
            int updateRow = 0; 
            myStatement.setString(1, userID);
            myStatement.setString(2, platformType);
            myStatement.setString(3, platformURL);
            myStatement.setString(4, projectName);
            updateRow = myStatement.executeUpdate();
            result = true;
        }catch (SQLException ex) {
                ex.printStackTrace();
                result = false;
                throw new SQLException();
        } finally {  
            Utils.releaseConnectionResource(myConnect, myStatement, myResultSet, this.getClass().getName());
            return result;   
        }
    }
    
    public boolean editPlatform(String userID, String projectName, String platformType, String platformURL) throws SQLException{
        java.sql.Connection myConnect = connect();
        PreparedStatement myStatement = null;
        ResultSet myResultSet = null;
        boolean result = false;
        try{
            myStatement = myConnect.prepareStatement(
                    "UPDATE " + Table.PLATFORM + " SET " + Column.PLATFORM_URL + "=?"
                     + " WHERE " + Column.USER_ID + "=? AND " + Column.PLATFORM_TYPE + "=? AND " + Column.PROJECT_NAME + "=?");
            myStatement.setString(1, platformURL);
            myStatement.setString(2, userID);
            myStatement.setString(3, platformType);
            myStatement.setString(4, projectName);
            if(myStatement.executeUpdate() == 0){
                result = false;
            }else{
                result = true;
            }
        }catch (SQLException ex) {
                ex.printStackTrace();
                result = false;
                throw new SQLException();
        } finally {  
            Utils.releaseConnectionResource(myConnect, myStatement, myResultSet, this.getClass().getName());
            return result;   
        }
    }
    
    public boolean deleteAllPlatforms(String userID) throws SQLException{
        java.sql.Connection myConnect = connect();
        PreparedStatement myStatement = null;
        ResultSet myResultSet = null;
        boolean result = false;
        try{
            myStatement = myConnect.prepareStatement(" DELETE FROM " + Table.PLATFORM + " WHERE " + Column.USER_ID + "=?");

            myStatement.setString(1, userID);
            myStatement.executeUpdate(); 
            result = true;
        }catch (SQLException ex) {
                ex.printStackTrace();
                result = false;
                throw new SQLException();
        } finally {  
            Utils.releaseConnectionResource(myConnect, myStatement, myResultSet, this.getClass().getName());
            return result;   
        }
    }
    
    public boolean deletePlatform(String userID, String projectName, String type) throws SQLException{
        java.sql.Connection myConnect = connect();
        PreparedStatement myStatement = null;
        ResultSet myResultSet = null;
        boolean result = false;
        try{
            myStatement = myConnect.prepareStatement(" DELETE FROM " + Table.PLATFORM + " WHERE " + Column.USER_ID + "=? AND " + Column.PROJECT_NAME + "=? AND " + Column.PLATFORM_TYPE + "=?");
            DebugLog.info(" DELETE FROM " + Table.PLATFORM + " WHERE " + Column.USER_ID + "= " + userID + " AND " + Column.PROJECT_NAME + "=" + projectName + " AND " + Column.PLATFORM_TYPE + "=" + type);
            myStatement.setString(1, userID);
            myStatement.setString(2, projectName);
            myStatement.setString(3, type);

            myStatement.executeUpdate(); 
            result = true;
        }catch (SQLException ex) {
                ex.printStackTrace();
                result = false;
                throw new SQLException();
        } finally {  
            Utils.releaseConnectionResource(myConnect, myStatement, myResultSet, this.getClass().getName());
            return result;   
        }
    }
    
    public boolean deleteTempPlatform(String userID, String projectName, String type) throws SQLException{
        java.sql.Connection myConnect = connect();
        PreparedStatement myStatement = null;
        ResultSet myResultSet = null;
        boolean result = false;
        try{
            DebugLog.info("deleteTempPlatform");
            myStatement = myConnect.prepareStatement(" DELETE FROM " + Table.TEMP_PLATFORM + " WHERE " + Column.USER_ID + "=? AND " + Column.PROJECT_NAME + "=? AND " + Column.PLATFORM_TYPE + "=?");
            DebugLog.info(" DELETE FROM " + Table.PLATFORM + " WHERE " + Column.USER_ID + "= " + userID + " AND " + Column.PROJECT_NAME + "=" + projectName + " AND " + Column.PLATFORM_TYPE + "=" + type);
            myStatement.setString(1, userID);
            myStatement.setString(2, projectName);
            myStatement.setString(3, type);

            myStatement.executeUpdate(); 
            result = true;
        }catch (SQLException ex) {
                ex.printStackTrace();
                result = false;
                throw new SQLException();
        } finally {  
            Utils.releaseConnectionResource(myConnect, myStatement, myResultSet, this.getClass().getName());
            return result;   
        }
    }
}
