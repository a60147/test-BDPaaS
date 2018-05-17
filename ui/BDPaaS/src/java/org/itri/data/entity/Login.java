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
public class Login {
    private boolean result;
    private String account;
    private String password;
    private String name;
    private Timestamp expiredDate;
    private int authority;
    
    public Login(boolean result){
        this.result = result;
        this.account = null; 
        this.password = null;
        this.name = null;

        this.authority = -1;
    }
    public Login(boolean result, String account, String password, String name, Timestamp expiredDate, int authority){
        this.result = result;
        this.account = account; 
        this.password = password;
        this.name = name;
        this.expiredDate = expiredDate;
        this.authority = authority;
    }
    
    public String getAccount(){
        return this.account;
    }
    
    public String getPassword(){
        return this.password;
    }
    
    public String getName(){
        return this.name;
    }
    
    public Timestamp getExpiredDate(){
        return this.expiredDate;
    }
    
    public int getAuthority(){
        return this.authority;
    }
    
    public boolean getResult(){
        return this.result;
    }
}
