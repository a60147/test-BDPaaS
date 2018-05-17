/*
    Author     : MuKai Huang
    Copyright (c) 2018 ITRI
 */
package org.itri.data.entity;

import java.sql.Timestamp;

/**
 *
 * @author Chris
 */
public class User {
    private String userID;
    private String userName;
    private String password;
    private Timestamp expiredDate;
    private int authority;
    public User(String userID, String userName, String password, Timestamp expiredDate, int authority){
        this.userID = userID;
        this.userName = userName;
        this.password = password;
        this.expiredDate = expiredDate;
        this.authority = authority;
    }
    
    public String getUserID(){
        return this.userID;
    }
    
    public String getUserName(){
        return this.userName;
    }
    
    public String getPassword(){
        return this.password;
    }
    
    public Timestamp getExpiredDate(){
        return this.expiredDate;
    }
    
    public int getAuthority(){
        return this.authority;
    }
}
