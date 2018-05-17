/*
    Author     : MuKai Huang
    Copyright (c) 2018 ITRI
 */
package org.itri.dataAccess;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;
import javax.naming.InitialContext;
import javax.naming.NamingException;
import javax.sql.DataSource;
import org.itri.data.Utils;
import org.itri.data.entity.Column;
import org.itri.data.entity.Database;
import org.itri.data.entity.Login;
import org.itri.data.entity.Table;
import org.itri.utils.DebugLog;


/**
 *
 * @author Chris
 */
public class AuthDBManager {
    private static AuthDBManager instance = null;
    private InitialContext context;
    private DataSource myDataSource; 
    public AuthDBManager(){
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
    
    public Login doLogin(String account, String password){
        java.sql.Connection myConnect = connect();
        PreparedStatement myStatement = null;
        ResultSet myResultSet = null;
        Login result = new Login(false);
        try{
            myStatement = myConnect.prepareStatement("SELECT * FROM " + Table.USER + " WHERE " + Column.USER_ID + "=?");            
            myStatement.setString(1, account);
            myResultSet = myStatement.executeQuery();

            if (myResultSet.next()) {
                DebugLog.info("has found");
                if(password.equals(myResultSet.getString(Column.PASSWORD))){
                    DebugLog.info("Login success");
                    result = new Login(true, 
                                       account, 
                                       password, 
                                       myResultSet.getString(Column.USER_NAME), 
                                       myResultSet.getTimestamp(Column.EXPIRED_DATE), 
                                       myResultSet.getInt(Column.AUTHORITY));
                }
                else{
                    DebugLog.info("Login failed");
                    result = new Login(false);
                }
            }
        }catch (SQLException ex) {
                ex.printStackTrace();
        } finally {  
            Utils.releaseConnectionResource(myConnect, myStatement, myResultSet, this.getClass().getName());
            return result;   
        }
    }
}
