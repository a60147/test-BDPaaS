/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package org.itri.data.entity;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Random;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 *
 * @author Chris
 */
public class Utils {
    public static boolean isInteger(String s) {
        try { 
            Integer.parseInt(s); 
        } catch(NumberFormatException e) { 
            return false; 
        } catch(NullPointerException e) {
            return false;
        }
        // only got here if we didn't return false
        return true;
    }
    
    public static String getRandomString(int length){
        if (length < 6) length = 6;
        String SALTCHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        StringBuilder salt = new StringBuilder();
        Random rnd = new Random();
        while (salt.length() < length) {
            int index = (int) (rnd.nextFloat() * SALTCHARS.length());
            salt.append(SALTCHARS.charAt(index));
        }
        String saltStr = salt.toString();
        return saltStr;
    }
    public static String getRandomString(){
        int length = 6;
        String SALTCHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
        StringBuilder salt = new StringBuilder();
        Random rnd = new Random();
        while (salt.length() < length) {
            int index = (int) (rnd.nextFloat() * SALTCHARS.length());
            salt.append(SALTCHARS.charAt(index));
        }
        String saltStr = salt.toString();
        return saltStr;
    }
    
    public static void releaseConnectionResource(java.sql.Connection myConnect, ArrayList<PreparedStatement> myStatementList, ArrayList<ResultSet> myResultSetList, String className){
        //close result set
        for(ResultSet myResultSet : myResultSetList){
            if(myResultSet!=null){
                try{
                    myResultSet.close();
                    myResultSet = null;
                }catch(Exception ex){
                    Logger.getLogger(className).log(Level.SEVERE, null, ex);
                }
            }
        }
        //close statement
        for(PreparedStatement myStatement : myStatementList){
            if(myStatement!=null){
                try{
                    myStatement.close();
                    myStatement = null;
                }catch(Exception ex){
                    Logger.getLogger(className).log(Level.SEVERE, null, ex);
                }
            }
        }
        //close connection
        try{
            myConnect.close();
            myConnect = null;
        }catch(Exception ex){
            Logger.getLogger(className).log(Level.SEVERE, null, ex);
        }
        //release resource 
        myResultSetList.clear();
        myStatementList.clear();
    }
    
    public static void releaseConnectionResource(java.sql.Connection myConnect, PreparedStatement myStatement, ArrayList<ResultSet> myResultSetList, String className){
        //close result set
        for(ResultSet myResultSet : myResultSetList){
            if(myResultSet!=null){
                try{
                    myResultSet.close();
                    myResultSet = null;
                }catch(Exception ex){
                    Logger.getLogger(className).log(Level.SEVERE, null, ex);
                }
            }
        }
        //close statement
        if(myStatement!=null){
            try{
                myStatement.close();
                myStatement = null;
            }catch(Exception ex){
                Logger.getLogger(className).log(Level.SEVERE, null, ex);
            }
        }
        //close connection
        try{
            myConnect.close();
            myConnect = null;
        }catch(Exception ex){
            Logger.getLogger(className).log(Level.SEVERE, null, ex);
        }
        //release resource 
        myResultSetList.clear();
    }
    
    public static void releaseConnectionResource(java.sql.Connection myConnect, ArrayList<PreparedStatement> myStatementList, String className){
        //close statement
        for(PreparedStatement myStatement : myStatementList){
            if(myStatement!=null){
                try{
                    myStatement.close();
                    myStatement = null;
                }catch(Exception ex){
                    Logger.getLogger(className).log(Level.SEVERE, null, ex);
                }
            }
        }
        //close connection
        try{
            myConnect.close();
            myConnect = null;
        }catch(Exception ex){
            Logger.getLogger(className).log(Level.SEVERE, null, ex);
        }
        //release resource 
        myStatementList.clear();
    }
    
    public static void releaseConnectionResource(java.sql.Connection myConnect, PreparedStatement myStatement, ResultSet myResultSet, String className){
        //close result set
        if(myResultSet!=null){
            try{
                myResultSet.close();
                myResultSet = null;
            }catch(Exception ex){
                Logger.getLogger(className).log(Level.SEVERE, null, ex);
            }
        }
        //close statement
        if(myStatement!=null){
            try{
                myStatement.close();
                myStatement = null;
            }catch(Exception ex){
                Logger.getLogger(className).log(Level.SEVERE, null, ex);
            }
        }
        //close connection
        try{
            myConnect.close();
            myConnect = null;
        }catch(Exception ex){
            Logger.getLogger(className).log(Level.SEVERE, null, ex);
        }
    }
    
    public static void releaseConnectionResource(java.sql.Connection myConnect, PreparedStatement myStatement, String className){
        //close statement
        if(myStatement!=null){
            try{
                myStatement.close();
                myStatement = null;
            }catch(Exception ex){
                Logger.getLogger(className).log(Level.SEVERE, null, ex);
            }
        }
        //close connection
        try{
            myConnect.close();
            myConnect = null;
        }catch(Exception ex){
            Logger.getLogger(className).log(Level.SEVERE, null, ex);
        }
    }
}
