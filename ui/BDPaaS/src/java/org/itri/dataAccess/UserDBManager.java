/*
    Author     : MuKai Huang
    Copyright (c) 2018 ITRI
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
import org.itri.data.entity.Column;
import org.itri.data.entity.Database;
import org.itri.data.entity.Table;
import org.itri.data.entity.User;
import org.itri.data.entity.Utils;
import org.itri.utils.DebugLog;


/**
 *
 * @author Chris
 */
public class UserDBManager {
    private static UserDBManager instance = null;
    private InitialContext context;
    private DataSource myDataSource; 
    public UserDBManager(){
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
    
    public ArrayList<User> getAllUsers() throws SQLException{
        java.sql.Connection myConnect = connect();
        PreparedStatement myStatement = null;
        ResultSet myResultSet = null;
        ArrayList<User> result = new ArrayList<User>();
        try{
            myStatement = myConnect.prepareStatement("SELECT * FROM " + Table.USER);            
            myResultSet = myStatement.executeQuery();
            while (myResultSet.next()) {
                
                result.add(new User(myResultSet.getString(Column.USER_ID),
                                    myResultSet.getString(Column.USER_NAME),
                                    myResultSet.getString(Column.PASSWORD),
                                    myResultSet.getTimestamp(Column.EXPIRED_DATE),
                                    myResultSet.getInt(Column.AUTHORITY)));
            }
        }catch (SQLException ex) {
                ex.printStackTrace();
                throw new SQLException();
        } finally {  
            Utils.releaseConnectionResource(myConnect, myStatement, myResultSet, this.getClass().getName());
            return result;   
        }
    }
    
    public User getTargetUser(String userID) throws SQLException{
        java.sql.Connection myConnect = connect();
        PreparedStatement myStatement = null;
        ResultSet myResultSet = null;
        User result = null;
        try{
            myStatement = myConnect.prepareStatement("SELECT * FROM " + Table.USER + " WHERE " + Column.USER_ID + "=?");  
            DebugLog.info("SELECT * FROM " + Table.USER + " WHERE " + Column.USER_ID + "=" + userID);
            myStatement.setString(1, userID);
            myResultSet = myStatement.executeQuery();
            if (myResultSet.next()) {
                DebugLog.info("exist...");
                result = new User(myResultSet.getString(Column.USER_ID),
                                    myResultSet.getString(Column.USER_NAME),
                                    myResultSet.getString(Column.PASSWORD),
                                    myResultSet.getTimestamp(Column.EXPIRED_DATE),
                                    myResultSet.getInt(Column.AUTHORITY));
            }
        }catch (SQLException ex) {
                ex.printStackTrace();
                throw new SQLException();
        } finally {  
            Utils.releaseConnectionResource(myConnect, myStatement, myResultSet, this.getClass().getName());
            return result;   
        }
    }
    
    public boolean addUser(String userID, String userName, String password, Timestamp expiredDate, int authority) throws SQLException{
        java.sql.Connection myConnect = connect();
        PreparedStatement myStatement = null;
        ResultSet myResultSet = null;
        boolean result = false;
        try{
           myStatement = myConnect.prepareStatement(" INSERT INTO " + Table.USER + " (" + Column.ID + "," + Column.USER_ID + "," + Column.USER_NAME + ","
                    + Column.PASSWORD + "," + Column.EXPIRED_DATE  + "," + Column.AUTHORITY + ") VALUES (NULL,?,?,?,?,?)", Statement.RETURN_GENERATED_KEYS);            
            int updateRow = 0; 
            myStatement.setString(1, userID);
            myStatement.setString(2, userName);
            myStatement.setString(3, password);
            myStatement.setTimestamp(4, expiredDate);
            myStatement.setInt(5, authority);
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
    
    public boolean editUser(String userID, String userName, String password, Timestamp expiredDate, int authority) throws SQLException{
        java.sql.Connection myConnect = connect();
        PreparedStatement myStatement = null;
        ResultSet myResultSet = null;
        boolean result = false;
        try{
            myStatement = myConnect.prepareStatement(
                    "UPDATE " + Table.USER + " SET " + Column.USER_NAME + "=?,"
                     + Column.PASSWORD + "=?," + Column.EXPIRED_DATE + "=?," + Column.AUTHORITY + "=? "
                     + " WHERE " + Column.USER_ID + "=?");
            myStatement.setString(1, userName);
            myStatement.setString(2, password);
            myStatement.setTimestamp(3, expiredDate);
            myStatement.setInt(4, authority);
            myStatement.setString(5, userID);
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
    
    public boolean deleteUser(String userID) throws SQLException{
        java.sql.Connection myConnect = connect();
        PreparedStatement myStatement = null;
        ResultSet myResultSet = null;
        boolean result = false;
        try{
            myStatement = myConnect.prepareStatement(" DELETE FROM " + Table.USER + " WHERE " + Column.USER_ID + "=?");

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
    
}
